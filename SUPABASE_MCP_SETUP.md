# Supabase MCP Setup Guide

This project is now configured with Supabase MCP (Model Context Protocol) to enable database editing directly from your AI assistant.

## What is Supabase MCP?

Supabase MCP allows you to interact with your Supabase database using natural language commands through your AI assistant. You can:
- Query data using SQL
- Insert, update, and delete records
- Manage database schema
- View and manage projects
- Access logs and debugging information

## Setup Instructions

### 1. Get Your Supabase Personal Access Token

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click on your profile icon (top right)
3. Go to "Access Tokens" in the account settings
4. Click "Generate new token"
5. Give it a name (e.g., "MCP Access Token")
6. Copy the generated token (you won't see it again!)

### 2. Configure MCP in Your Editor

The project already includes a `.vscode/mcp.json` configuration file with your project reference (`lbmortayknpfqkpwuvmy`).

#### For VS Code with Copilot:
1. Open VS Code
2. The MCP configuration is already set up in `.vscode/mcp.json`
3. When prompted, enter your Supabase personal access token
4. Click "Start" on the Supabase server in the MCP panel
5. Switch to "Agent" mode in Copilot chat

#### For Windsurf:
1. Open Windsurf
2. Access the Cascade assistant
3. Click "Customizations" → "Configure"
4. Add the following configuration:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=lbmortayknpfqkpwuvmy"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_ACCESS_TOKEN_HERE"
      }
    }
  }
}
```

## Your Database Schema

Your Supabase project includes these tables:

### 📺 Videos Table
- `id`, `title`, `description`, `author`
- `video_url`, `thumbnail`, `duration`
- `views`, `likes`, `tags`
- `is_featured`, `is_trending`
- `created_at`, `updated_at`

### 📢 Ads Table
- `id`, `title`, `ad_code`, `ad_type`
- `placement`, `priority`
- `image_url`, `link_url`
- `start_date`, `end_date`
- `is_active`, `click_count`, `impression_count`
- `created_at`, `updated_at`

### ⚙️ Content Settings Table
- `id`, `key`, `section`, `value`
- `content_type`, `description`
- `created_at`, `updated_at`

### 🔍 SEO Settings Table
- `id`, `page_type`, `title`, `description`
- `keywords`, `canonical_url`
- `og_title`, `og_description`, `og_image`
- `meta_robots`
- `created_at`, `updated_at`

## Example Commands

Once MCP is set up, you can use natural language commands like:

- "Show me all videos in the database"
- "Add a new video with title 'My Video' and author 'John Doe'"
- "Update the video with ID '123' to set is_featured to true"
- "Delete all inactive ads"
- "Show me the top 10 most viewed videos"
- "Create a new ad for the header placement"

## Troubleshooting

1. **Token Issues**: Make sure your personal access token is valid and has the right permissions
2. **Connection Issues**: Check that your project reference is correct (`lbmortayknpfqkpwuvmy`)
3. **Permission Issues**: Ensure your token has access to the project

## Security Notes

- Keep your personal access token secure
- Don't commit the token to version control
- Use environment variables for production deployments
- Consider using service role keys for automated systems

## Next Steps

1. Set up your personal access token
2. Configure MCP in your preferred editor
3. Test with simple queries like "Show me all videos"
4. Start managing your database with natural language commands!

Your project is now ready for AI-powered database management! 🚀

