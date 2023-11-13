echo "Deploying to GitHub"
rm -rf dist
mkdir dist
yarn build
cp -r public dist/
cp src/* dist/
cd dist
git init
git add -A
git commit -m "New Deployment"
git push -f git@github.com:worthant/adaptive-design.git master:gh-pages
cd -