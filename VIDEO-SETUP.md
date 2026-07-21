# Database Setup Instructions for Video Showcase

## Step 1: Check if your database is set up

Visit this URL in your browser:
```
http://localhost:3000/api/simple-test
```

**Expected Result:**
- ✅ **Success**: "Videos table is accessible" → Your database is ready, skip to Step 3
- ❌ **Error**: "Cannot access videos table" → Continue to Step 2

## Step 2: Run the Database Migration

If Step 1 showed an error:

1. **Go to your Supabase dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Sign in to your account

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - This will open a query editor

3. **Run the migration script**
   - Copy the contents of: `pejah/migrate-database.sql`
   - Paste it into the SQL Editor
   - Click the "RUN" button

4. **Verify the migration**
   - You should see: "Database migration completed successfully"
   - No error messages should appear

5. **Test again**
   - Go back to: `http://localhost:3000/api/simple-test`
   - Should now show: "Videos table is accessible"

## Step 3: Access Video Management

1. **Go to:** `/admin/videos`
2. **You should see:**
   - A clean interface with stats
   - "Add Video" button
   - No database setup warnings

## Step 4: Upload Your First Video

1. **Click "Add Video"**
2. **Upload a video file** (max 50MB, MP4/WebM/MOV)
3. **Add a description** (this is what will show in the video gallery)
4. **Optional:** Mark as "Featured" or set display order
5. **Click "Add Video"**

## Step 5: View the Results

1. **Go to:** `/services`
2. **You should see:**
   - The new outstanding design
   - A "Video Gallery" section with your video
   - Play/pause functionality
   - Video description displayed

## Troubleshooting

### If you see "Database Not Set Up" on the admin page:
- This means the videos table doesn't exist
- Follow Step 2 above to run the migration

### If video upload fails:
- Check the browser console for error messages
- Ensure your Cloudinary environment variables are set
- Try a smaller video file (under 10MB)

### If video doesn't play on the services page:
- Check the browser console for specific errors
- Ensure the video is in MP4 format
- Try uploading the video again

## Quick Test

After running the migration, test all endpoints:
- `/api/simple-test` - Check database status
- `/api/videos` - List all videos (should be empty array initially)
- `/admin/videos` - Access video management

## Expected Database Structure

After migration, your database should have:
- `videos` table with: id, video_url, video_public_id, description, is_featured, display_order, created_at, updated_at
- `services` table with all required columns including video_url and gallery
- Proper indexes and triggers for performance