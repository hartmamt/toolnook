#!/bin/bash

# File with the new footer content
cat > new_footer.txt << 'EOF'
    <footer>
        <div class="container">
            <p>&copy; 2025 ToolNook.dev - All tools are free to use | <a href="/privacy.html" style="color:var(--primary-color);">Privacy Policy</a> | <a href="/about.html" style="color:var(--primary-color);">About</a></p>
        </div>
    </footer>
EOF

# Find all tool index.html files
find /Users/hartman.m/Projects/quickly/toolnook/tools -name "index.html" -type f | while read -r file; do
  # Extract everything before the footer
  awk '/<footer>/,0{exit} {print}' "$file" > before_footer.txt
  
  # Extract everything after the footer
  awk 'f{print} /<\/footer>/{f=1}' "$file" > after_footer.txt
  
  # Combine parts to create the updated file
  cat before_footer.txt new_footer.txt after_footer.txt > updated_file.txt
  
  # Replace the original file
  mv updated_file.txt "$file"
  
  echo "Updated $file"
done

# Clean up temporary files
rm -f before_footer.txt new_footer.txt after_footer.txt

# Count the number of files updated
count=$(find /Users/hartman.m/Projects/quickly/toolnook/tools -name "index.html" -type f | wc -l)
echo "Total files updated: $count"