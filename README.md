# Manganese Limestone Site

Prototype site for manganese limestone supply to metallurgical enterprises.

## Local Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages

The project includes `.github/workflows/deploy.yml`.
After pushing to the `main` branch, GitHub Actions builds the site and publishes `dist` to GitHub Pages.

For a new repository:

```bash
gh auth login
gh repo create manganese-site --public --source=. --remote=origin --push
```

In the GitHub repository settings, set Pages source to `GitHub Actions` if it is not selected automatically.
