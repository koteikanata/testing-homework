for ((i=1; i < 10; i++))
do
npx cross-env BUG_ID=$i jest
done