/*
  # Update Product Policies
  
  1. Changes
    - Drop existing policies to avoid conflicts
    - Add specific DELETE policy
    - Maintain public read access
  
  2. Security
    - Anyone can view products
    - Users can only modify their own products
    - Users can only delete their own products
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Users can modify their own products" ON public.products;
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;

-- Recreate policies with proper permissions
CREATE POLICY "Anyone can view products"
  ON public.products
  FOR SELECT
  USING (true);

CREATE POLICY "Users can modify their own products"
  ON public.products
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);