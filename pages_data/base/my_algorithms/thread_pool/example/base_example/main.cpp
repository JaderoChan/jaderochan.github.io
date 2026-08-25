#include <iostream>
#include <random>

#include <thread_pool.hpp>

static int generateRandomNum()
{
    static std::random_device rd;
    static std::mt19937_64 gen(rd());
    static std::uniform_int_distribution<int> distrib(0, 1000);
    return distrib(gen);
}

static void randomDo()
{
    static int i = 0;
    const  int n = generateRandomNum();
    std::this_thread::sleep_for(std::chrono::milliseconds(n));
    std::cout << i++ << ": I am sleep for " << n << "ms" << std::endl;
}

int main(int argc, char* argv[])
{
    constexpr std::size_t TASK_NUM = 100;

    ThreadPool pool(4);
    for (std::size_t i = 0; i < TASK_NUM; ++i)
        pool.submit(&randomDo);
    pool.wait();

    return 0;
}
