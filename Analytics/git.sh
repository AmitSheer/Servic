if [ "$1 $2" = "push only" ]; then
    cd ..
    git push upstream main
    exit 1
elif [ "$1" = "pull" ]; then
    cd ..
    git fetch upstream
    git merge upstream/main
    exit 1
fi


echo "Commit name:";
read name

if [ "$name" = "" ]; then
    (>&2 echo "commit name must be non empty!"; exit $ERRCODE)
fi
cd .. 
git add .
git commit -m "$name"
git push
git push upstream main