/*
  # Update Product Policies
  
  1. Changes
    - Remove user_id restriction for SELECT operations
    - Keep user_id restrictions for INSERT/UPDATE/DELETE
  
  2. Security
    - Allow public read access to all products
    - Maintain user-specific write access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;

-- Create new public read policy
CREATE POLICY "Anyone can view products"
  ON public.products
  FOR SELECT
  USING (true);

-- Create policy for user-specific operations
CREATE POLICY "Users can modify their own products"
  ON public.products
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);