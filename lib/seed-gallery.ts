import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const gallerySeed = [
  {
    style_name: 'Knotless Cornrows',
    length: 'Medium',
    color: 'Black',
    image: '/first.jpeg',
    description: 'Classic knotless cornrows with intricate pattern'
  },
  {
    style_name: 'Boho',
    length: 'Long',
    color: 'Brown',
    image: '/second.jpeg',
    description: 'Bohemian style with loose curls and tribal beads'
  },
  {
    style_name: 'Fulani',
    length: 'Medium',
    color: 'Ombre',
    image: '/third.jpeg',
    description: 'Fulani braids with traditional cowrie shell accessories'
  },
];

async function main() {
  // Use a deterministic upsert by style_name+length+color (or you can expand matching criteria)
  // Since the table currently has no unique constraint, we do an existence check per row.
  for (const item of gallerySeed) {
    const { data: existing, error: findErr } = await supabase
      .from('gallery')
      .select('id')
      .eq('style_name', item.style_name)
      .eq('length', item.length)
      .eq('color', item.color)
      .limit(1);

    if (findErr) throw findErr;

    if (existing && existing.length > 0) continue;

    const { error: insertErr } = await supabase
      .from('gallery')
      .insert({
        style_name: item.style_name,
        length: item.length,
        color: item.color,
        image: item.image,
        description: item.description
      });

    if (insertErr) throw insertErr;
  }

  console.log('Gallery seed completed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

