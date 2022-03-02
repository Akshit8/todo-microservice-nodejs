import PQueue from "p-queue";

const queue = new PQueue({ concurrency: 2 });

const asyncTask = async () => {
  setTimeout(() => {
    console.log("asyncTask completed");
  }, 3000);
};

(async () => {
  const tasks = [asyncTask, asyncTask, asyncTask];

  await queue.addAll(tasks);
})();
