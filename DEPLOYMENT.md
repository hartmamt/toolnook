# Deploying ToolNook.dev to Vercel

This guide will help you deploy the ToolNook.dev project to Vercel and connect your custom domain.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. The `toolnook.dev` domain (which you already own)
3. Git repository with your ToolNook code

## Deployment Steps

### 1. Push your code to a Git repository

If your code isn't already in a Git repository:

```bash
# Initialize a new git repository
git init
# Add all files
git add .
# Commit the files
git commit -m "Initial commit"
# Add your remote repository (GitHub, GitLab, etc.)
git remote add origin YOUR_REPOSITORY_URL
# Push to the repository
git push -u origin main
```

### 2. Connect to Vercel

1. Log in to your [Vercel dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Select "Other" (or Node.js)
   - Root Directory: Leave as is (should be the project root)
   - Build Command: `npm run vercel-build`
   - Output Directory: Leave empty (not used)
   - Install Command: `npm install`

5. Click "Deploy"

### 3. Connect Your Domain

1. After deployment, go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Domains"
3. Enter `toolnook.dev` and click "Add"
4. Follow Vercel's instructions for DNS configuration:
   - If your domain is registered elsewhere, you'll need to configure DNS records
   - If your domain is registered with Vercel, it will be configured automatically

### 4. Configure DNS Records

If your domain is registered with another provider, you'll need to add these DNS records:

1. An `A` record pointing to Vercel's IP address:
   - Name: `@` or blank
   - Value: `76.76.21.21`

2. A `CNAME` record for the `www` subdomain:
   - Name: `www`
   - Value: `cname.vercel-dns.com.`

### 5. Verify Domain Settings

1. Wait for DNS propagation (can take up to 48 hours)
2. Once verified, Vercel will automatically issue an SSL certificate
3. Your site should now be accessible at `https://toolnook.dev`

## Managing Your Deployment

### Automatic Deployments

By default, Vercel will automatically deploy when you push changes to your Git repository.

### Preview Deployments

Vercel creates preview deployments for pull requests, allowing you to test changes before merging.

### Environment Variables

If needed, you can add environment variables in the Vercel dashboard under:
Settings > Environment Variables

## Troubleshooting

If you encounter issues with your deployment:

1. Check the build logs in the Vercel dashboard
2. Verify DNS configuration is correct
3. Ensure all necessary files are committed to your repository
4. Try deploying again with an updated commit

For more help, consult the [Vercel documentation](https://vercel.com/docs).