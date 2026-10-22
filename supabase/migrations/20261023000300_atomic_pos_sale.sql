create or replace function public.record_pos_sale(p_sale jsonb, p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  v_product_id text;
  v_qty numeric;
  v_stock numeric;
  v_sale_id text;
begin
  if jsonb_typeof(p_sale) <> 'object' or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Invalid sale payload';
  end if;
  v_sale_id := coalesce(nullif(p_sale->>'transaction_id',''), 'SALE-' || replace(gen_random_uuid()::text,'-',''));
  for item in select value from jsonb_array_elements(p_items)
  loop
    v_product_id := coalesce(item->>'product_id', item->>'id', '');
    v_qty := coalesce(nullif(item->>'quantity','')::numeric, nullif(item->>'qty','')::numeric, 0);
    if v_product_id = '' or v_qty <= 0 then raise exception 'Each sale item needs product_id and positive quantity'; end if;
    select stock into v_stock from public.products where product_id = v_product_id for update;
    if not found then raise exception 'Product not found: %', v_product_id; end if;
    if coalesce(v_stock,0) < v_qty then raise exception 'Insufficient stock for product %', v_product_id; end if;
  end loop;
  for item in select value from jsonb_array_elements(p_items)
  loop
    v_product_id := coalesce(item->>'product_id', item->>'id', '');
    v_qty := coalesce(nullif(item->>'quantity','')::numeric, nullif(item->>'qty','')::numeric, 0);
    update public.products set stock = coalesce(stock,0) - v_qty where product_id = v_product_id;
    insert into public.stock_movement(date, product_id, type, quantity, reason, datetime)
    values (coalesce(p_sale->>'date', to_char(now() at time zone 'Asia/Manila','YYYY-MM-DD')), v_product_id, 'SALE', -v_qty, 'POS sale ' || v_sale_id, coalesce(p_sale->>'datetime', now()::text));
  end loop;
  insert into public.sales(date, transaction_id, items, total, profit, payment, change, item_details, time, payment_method, datetime, payment_transaction_id)
  values (
    coalesce(p_sale->>'date', to_char(now() at time zone 'Asia/Manila','YYYY-MM-DD')),
    v_sale_id,
    coalesce(nullif(p_sale->>'items','')::integer, jsonb_array_length(p_items)),
    coalesce(nullif(p_sale->>'total','')::double precision,0),
    coalesce(nullif(p_sale->>'profit','')::double precision,0),
    coalesce(nullif(p_sale->>'payment','')::double precision,0),
    coalesce(nullif(p_sale->>'change','')::double precision,0),
    p_items::text,
    coalesce(p_sale->>'time', to_char(now() at time zone 'Asia/Manila','HH24:MI:SS')),
    coalesce(p_sale->>'payment_method','CASH'),
    coalesce(p_sale->>'datetime', now()::text),
    p_sale->>'payment_transaction_id'
  );
  return jsonb_build_object('ok',true,'transaction_id',v_sale_id);
end;
$$;
revoke all on function public.record_pos_sale(jsonb,jsonb) from public, anon, authenticated;
grant execute on function public.record_pos_sale(jsonb,jsonb) to service_role;