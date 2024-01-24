-- Create a table for public Users, Profiles, Address
create table tb_users (
    id uuid not null primary key,
    roles text,
    created_at timestamp with time zone,
    username text,
    email text,
    password text
);
create table tb_profiles (
    id uuid references public.tb_users on delete cascade not null primary key,
    created_at timestamp with time zone,
    company_name text,
    avatar_url text,
    sos_ig text,
    sos_tiktok text,
    sos_youtube text,
    usr_phone text
);
create table tb_address (
    id uuid references public.tb_users on delete cascade not null primary key,
    created_at timestamp with time zone,
    person_name text,
    addr_detail text,
    addr_city text,
    addr_note text,
    addr_zip_code text
);
-- Create a table for public Categories
create table tb_prd_categories (
    id uuid not null primary key,
    created_at timestamp with time zone,
    ct_name text,
    slug text
);
-- Create a table for public Products
create table tb_products (
    id uuid not null primary key,
    category_id uuid references public.tb_prd_categories on delete cascade not null,
    user_id uuid references public.tb_users on delete cascade not null,
    created_at timestamp with time zone,
    prd_code text,
    prd_name text,
    prd_descript text,
    prd_img text,
    prd_price text,
    prd_barcode text,
    prd_act_discount text,
    prd_set_discount text,
    prd_current_qty text,
    prd_labdoor boolean,
    prd_in_stock boolean,
    prd_is_active boolean,
    prd_is_clerance boolean,
    prd_sequence integer
);
-- Create a table for public Composition, Flavor, Size, Images   
create table tb_prd_composition (
    id uuid references public.tb_products on delete cascade not null,
    created_at timestamp with time zone,
    comp_name text,
    comp_type text,
    comp_is_active boolean
);

create table tb_prd_flavor (
    id uuid references public.tb_products on delete cascade not null,
    updated_at timestamp with time zone,
    flavor_name text
);
create table tb_prd_size (
    id uuid references public.tb_products on delete cascade not null,
    updated_at timestamp with time zone,
    size_number text,
    size_type text,
    size_price text,
    qty text
);
create table tb_prd_rating (
    id uuid references public.tb_products on delete cascade not null,
    created_at timestamp with time zone,
    rate_comment text,
    rate_name text,
    rate_count integer
);


-- Create Customer Table Blog, Recipes, assets
create table tb_post_categories (
    id uuid not null primary key,
    created_at timestamp with time zone,
    ct_post_name text,
    slug text
);
create table tb_posts (
    id uuid not null primary key,
    user_id uuid references public.tb_users on delete cascade not null,
    category_id uuid references public.tb_post_categories on delete cascade not null,
    title text,
    slug text,
    img_post text,
    img_link text,
    category text,
    keywords text,
    summary text,
    description text,
    created_at timestamp
);

create table tb_recipe_categories (
    id uuid not null primary key,
    created_at timestamp with time zone,
    ct_recipe_name text,
    slug text
);
create table tb_recipes (
    id uuid not null primary key,
    user_id uuid references public.tb_users on delete cascade not null,
    recipe_name text,
    slug text,
    category text,
    calories text,
    protein text,
    recipe_ingredients text,
    img_recipe text,
    link_video text,
    created_at timestamp
);

create table tb_midtrans_customers (
  user_id uuid references public.tb_users on delete cascade not null primary key,
  created_at timestamp with time zone,
  midtrans_customer_id text unique
);

-- Create Customer Table Order
create table tb_shipping (
    id uuid not null primary key,
    user_id uuid references public.tb_users on delete cascade not null,
    address_id uuid references public.tb_address on delete cascade not null,
    shipp_name text,
    addr_detail text,
    addr_province text,
    addr_city text,
    addr_note text,
    addr_zip_code text
);

create table tb_order_details (
    id uuid not null primary key,
    prd_id uuid references public.tb_products on delete cascade not null,
    prd_name text,
    prd_size text,
    prd_amount integer,
    prd_price integer
);

create table tb_order (
    id uuid not null primary key,
    user_id uuid references public.tb_users on delete cascade not null,
    midtrans_id uuid references public.tb_midtrans_customers on delete cascade not null,
    order_details_id uuid references public.tb_order_details on delete cascade not null,
    shipping_id uuid references public.tb_shipping on delete cascade not null,
    gross_amount integer,
    order_status text,
    shipping_status text,
    resi text,
    created_at timestamp with time zone
);

create table tb_assets (
    id uuid not null primary key,
    user_id uuid references public.tb_users on delete cascade not null,
    category text, 
    title text,
    img_asset text,
    img_link text,
    created_at timestamp
);

