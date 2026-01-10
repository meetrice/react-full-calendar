-- ============================================
-- Supabase Storage policies for meetsupas bucket
-- 在 Supabase Dashboard → SQL Editor 中执行此脚本
-- ============================================

-- 删除现有的旧策略（如果存在）
DROP POLICY IF EXISTS "Allow public select avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to avatars" ON storage.objects;

-- ============================================
-- 策略 1: 允许所有人公开查看 avatars 文件夹中的文件
-- ============================================
CREATE POLICY "Allow public select avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'meetsupas' AND (storage.foldername(name))[1] = 'avatars');

-- ============================================
-- 策略 2: 允许已认证用户上传头像
-- ============================================
CREATE POLICY "Allow authenticated insert avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'meetsupas' AND
  (storage.foldername(name))[1] = 'avatars' AND
  auth.role() = 'authenticated'
);

-- ============================================
-- 策略 3: 允许已认证用户更新头像
-- ============================================
CREATE POLICY "Allow authenticated update avatars"
ON storage.objects FOR UPDATE
WITH CHECK (
  bucket_id = 'meetsupas' AND
  (storage.foldername(name))[1] = 'avatars' AND
  auth.role() = 'authenticated'
);

-- ============================================
-- 策略 4: 允许已认证用户删除头像
-- ============================================
CREATE POLICY "Allow authenticated delete avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'meetsupas' AND
  (storage.foldername(name))[1] = 'avatars' AND
  auth.role() = 'authenticated'
);

-- ============================================
-- 执行完 SQL 后，还需要：
-- 1. 去 Supabase Dashboard → Storage → meetsupas
-- 2. 点击 bucket 旁边的齿轮图标 → "Make public" 或者
-- 3. 在 avatars 文件夹上右键 → Make Public
-- ============================================
