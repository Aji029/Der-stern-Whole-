import { supabase } from '../supabase';
import type { Product } from '../../types/product';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return data.map(item => ({
      artikelNr: item.artikel_nr,
      name: item.name,
      vkPrice: item.vk_price,
      ekPrice: item.ek_price,
      mwst: item.mwst,
      packungArt: item.packung_art,
      packungInhalt: item.packung_inhalt,
      herkunftsland: item.herkunftsland,
      produktgruppe: item.produktgruppe,
      supplierId: item.supplier_id,
      image: item.image_url
    }));
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

export async function createProduct(product: Omit<Product, 'image'> & { image: File | null }): Promise<void> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) throw new Error('Authentication required');

    let imageUrl = null;
    if (product.image) {
      const fileExt = product.image.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(fileName, product.image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      imageUrl = publicUrl;
    }

    const { error } = await supabase
      .from('products')
      .insert([{
        artikel_nr: product.artikelNr,
        name: product.name,
        vk_price: product.vkPrice,
        ek_price: product.ekPrice,
        mwst: product.mwst,
        packung_art: product.packungArt,
        packung_inhalt: product.packungInhalt,
        herkunftsland: product.herkunftsland,
        produktgruppe: product.produktgruppe,
        supplier_id: product.supplierId,
        image_url: imageUrl,
        user_id: user.id
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
}

export async function updateProduct(artikelNr: string, product: Omit<Product, 'image'> & { image: File | null }): Promise<void> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) throw new Error('Authentication required');

    let imageUrl = null;
    if (product.image instanceof File) {
      const fileExt = product.image.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, product.image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      imageUrl = publicUrl;
    }

    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        vk_price: product.vkPrice,
        ek_price: product.ekPrice,
        mwst: product.mwst,
        packung_art: product.packungArt,
        packung_inhalt: product.packungInhalt,
        herkunftsland: product.herkunftsland,
        produktgruppe: product.produktgruppe,
        supplier_id: product.supplierId,
        ...(imageUrl && { image_url: imageUrl })
      })
      .eq('artikel_nr', artikelNr)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
}

export async function deleteProduct(artikelNr: string): Promise<void> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) throw new Error('Authentication required');

    // First get the product to check the image
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('image_url')
      .eq('artikel_nr', artikelNr)
      .eq('user_id', user.id)
      .single();

    if (fetchError) throw fetchError;

    // Delete the image if it exists
    if (product?.image_url) {
      const fileName = product.image_url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('product-images')
          .remove([fileName]);
      }
    }

    // Delete the product
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('artikel_nr', artikelNr)
      .eq('user_id', user.id);

    if (deleteError) throw deleteError;
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
}