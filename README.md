# ToolNook.dev

A collection of handy micro-tools for everyday tasks. ToolNook.dev provides a platform for hosting and using various utility tools in one convenient location.

## Project Structure

```
toolnook/
├── common/             # Shared resources across all tools
│   ├── css/            # Shared CSS files
│   └── js/             # Shared JavaScript files
├── public/             # Public-facing files
│   ├── index.html      # Main landing page that lists all tools
│   └── assets/         # Images, icons, and other static assets
└── tools/              # Individual tools/micro-apps
    ├── template/       # Template for creating new tools
    └── [tool-name]/    # Each tool has its own directory
```

## Adding a New Tool

To add a new tool to ToolNook.dev:

1. Create a new directory in the `tools/` folder with your tool's name
   ```
   mkdir tools/your-tool-name
   ```

2. Copy the template files as a starting point
   ```
   cp tools/template/* tools/your-tool-name/
   ```

3. Edit the files to implement your tool:
   - `index.html` - Update the title, description, and tool-specific HTML
   - `style.css` - Add tool-specific styles
   - `script.js` - Implement your tool's functionality

4. Add your tool to the main page by editing `public/index.html` and adding a new tool card:
   ```html
   <div class="tool-card" data-tool-id="your-tool-name">
       <h3>Your Tool Name</h3>
       <p>Description of your tool</p>
       <a href="/tools/your-tool-name/" class="btn">Open Tool</a>
   </div>
   ```

## Tool Development Guidelines

When creating a new tool, follow these guidelines:

1. Each tool should be self-contained in its own directory
2. Use the common CSS/JS for consistent styling and shared functionality
3. Keep tools focused on a single purpose
4. Ensure responsive design works on all device sizes
5. Provide clear instructions on how to use the tool
6. Handle errors gracefully with user-friendly messages

## Deployment

To deploy ToolNook.dev, you can use any static site hosting service like:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront

Simply point the hosting service to the root directory of this project.

## License

[MIT License](LICENSE)