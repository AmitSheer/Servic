# script to push and pull from and too the main repository

if [ "$1 $2" = "push only" ]; then
    cd ..
    git fetch upstream
    git push upstream main
    exit 1
elif [ "$1 $3" = "push only" ]; then
    cd ..
    git fetch upstream
    git push upstream $2
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

if [ "$1" = "push" ]; then
    if [ "$2" = "" ]; then
        git push upstream main
    else
        git push upstream $2
    fi
fi