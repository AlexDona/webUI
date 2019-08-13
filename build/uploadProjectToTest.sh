rm -rf ../dist/dist/*
mv ../dist/static ../dist/dist
mv ../dist/index.html ../dist/dist
git st
git add .
git cmt -m "style: 更新代码"
git pull origin test
git push -u origin test
