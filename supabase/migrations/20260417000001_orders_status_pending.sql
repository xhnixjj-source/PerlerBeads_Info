-- Allow pre-checkout rows with status Pending (see app/api/orders/prep).
alter table public.orders drop constraint if exists orders_status_check;

alter table public.orders
  add constraint orders_status_check
  check (status in ('Pending', 'Paid', 'Shipped', 'Delivered', 'Canceled'));
