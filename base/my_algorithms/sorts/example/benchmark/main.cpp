#include <cstdint>
#include <ctime>
#include <algorithm>
#include <iostream>
#include <random>
#include <string>
#include <vector>

#include <sorts.h>

class ElapsedTimer
{
public:
    ElapsedTimer() : start_(clock()) {}

    void     restart()
    { start_ = clock(); }

    double   elapsedSec() const
    { return static_cast<double>(clock() - start_) / static_cast<double>(CLOCKS_PER_SEC); }
    uint64_t elapsedMs() const
    { return static_cast<uint64_t>(elapsedSec() * 1000.0); }

    double   elapsedSecRestart()
    { const double sec  = elapsedSec(); restart(); return sec; }
    uint64_t elapsedMsRestart()
    { const uint64_t ms = elapsedMs();  restart(); return ms;}

private:
    clock_t start_;
};

static std::vector<int> generateRandomNums(size_t count, int min, int max)
{
    std::random_device rd;
    std::mt19937_64 mt(rd());
    std::uniform_int_distribution<int> uni(min, max);

    std::vector<int> nums;
    nums.reserve(count);
    while (count--)
        nums.push_back(uni(mt));

    return nums;
}

static bool isEqualNums(const std::vector<int>& nums1, const std::vector<int>& nums2)
{
    if (nums1.size() != nums2.size())
        return false;

    const size_t n = nums1.size();
    for (size_t i = 0; i < n; ++i)
    {
        if (nums1[i] != nums2[i])
            return false;
    }
    return true;
}

template <typename T>
static std::ostream& operator<<(std::ostream& os, const std::vector<T>& arr)
{
    constexpr size_t cols = 16;
    size_t rows = static_cast<size_t>(static_cast<double>(arr.size()) / static_cast<double>(cols));
    for (size_t row = 0; row < rows; ++row)
    {
        os << "[";
        for (size_t col = 0; col < cols; ++col)
        {
            const size_t idx = row * cols + col;
            if (idx >= arr.size())
                break;
            os << arr[idx] << (col != cols - 1 ? ",\t" : "");
        }
        os << "]" << (row != rows - 1 ? "\n" : "");
    }
    return os;
}

JCALGO_DEFINE_BUBBLE_SORT(int, JCALGO_LESS_THAN)
JCALGO_DEFINE_SELECT_SORT(int, JCALGO_LESS_THAN)
JCALGO_DEFINE_INSERT_SORT(int, JCALGO_LESS_THAN)
JCALGO_DEFINE_SHELL_SORT(int, JCALGO_LESS_THAN)
JCALGO_DEFINE_MERGE_SORT(int, JCALGO_LESS_THAN)
JCALGO_DEFINE_QUICK_SORT(int, JCALGO_LESS_THAN)
JCALGO_DEFINE_HEAP_SORT(int, JCALGO_LESS_THAN)

int main(int argc, char* argv[])
{
    constexpr size_t n = 10000;
    constexpr bool printNums = false;
    const std::vector<int> originNums = generateRandomNums(n, -10000, 10000);
    if (printNums)
    {
        std::cout << "------------------------------\n";
        std::cout << "Origin Nums:\n------------------------------\n" << originNums << "\n";
        std::cout << std::endl;
    }

    std::vector<int> sortedNums = originNums;
    std::sort(sortedNums.begin(), sortedNums.end());

    ElapsedTimer et;

    // Bubble sort
    if (true)
    {
        std::vector<int> nums = originNums;
        et.restart();
        jcalgo_bubble_sort_int(nums.data(), n);
        double elapsed = et.elapsedSec();
        if (printNums)
        {
            std::cout << "------------------------------\n";
            std::cout << "Bubble sorted nums:\n------------------------------\n" << nums << "\n";
        }
        std::cout << "[Bubble sort elapsed: " << elapsed << "]\n";
        std::cout << "[" << (isEqualNums(nums, sortedNums) ? "Correct" : "Uncorrect") << "]\n";
        std::cout << std::endl;
    }

    // Select sort
    if (true)
    {
        std::vector<int> nums = originNums;
        et.restart();
        jcalgo_select_sort_int(nums.data(), n);
        double elapsed = et.elapsedSec();
        if (printNums)
        {
            std::cout << "------------------------------\n";
            std::cout << "Select sorted nums:\n------------------------------\n" << nums << "\n";
        }
        std::cout << "[Select sort elapsed: " << elapsed << "]\n";
        std::cout << "[" << (isEqualNums(nums, sortedNums) ? "Correct" : "Uncorrect") << "]\n";
        std::cout << std::endl;
    }

    // Insert sort
    if (true)
    {
        std::vector<int> nums = originNums;
        et.restart();
        jcalgo_insert_sort_int(nums.data(), n);
        double elapsed = et.elapsedSec();
        if (printNums)
        {
            std::cout << "------------------------------\n";
            std::cout << "Insert sorted nums:\n------------------------------\n" << nums << "\n";
        }
        std::cout << "[Insert sort elapsed: " << elapsed << "]\n";
        std::cout << "[" << (isEqualNums(nums, sortedNums) ? "Correct" : "Uncorrect") << "]\n";
        std::cout << std::endl;
    }

    // Shell sort
    if (true)
    {
        std::vector<int> nums = originNums;
        et.restart();
        jcalgo_shell_sort_int(nums.data(), n);
        double elapsed = et.elapsedSec();
        if (printNums)
        {
            std::cout << "------------------------------\n";
            std::cout << "Shell sorted nums:\n------------------------------\n" << nums << "\n";
        }
        std::cout << "[Shell sort elapsed: " << elapsed << "]\n";
        std::cout << "[" << (isEqualNums(nums, sortedNums) ? "Correct" : "Uncorrect") << "]\n";
        std::cout << std::endl;
    }

    // Merge sort
    if (true)
    {
        std::vector<int> nums = originNums;
        et.restart();
        jcalgo_merge_sort_int(nums.data(), n);
        double elapsed = et.elapsedSec();
        if (printNums)
        {
            std::cout << "------------------------------\n";
            std::cout << "Merge sorted nums:\n------------------------------\n" << nums << "\n";
        }
        std::cout << "[Merge sort elapsed: " << elapsed << "]\n";
        std::cout << "[" << (isEqualNums(nums, sortedNums) ? "Correct" : "Uncorrect") << "]\n";
        std::cout << std::endl;
    }

    // Quick sort
    if (true)
    {
        std::vector<int> nums = originNums;
        et.restart();
        jcalgo_quick_sort_int(nums.data(), n);
        double elapsed = et.elapsedSec();
        if (printNums)
        {
            std::cout << "------------------------------\n";
            std::cout << "Quick sorted nums:\n------------------------------\n" << nums << "\n";
        }
        std::cout << "[Quick sort elapsed: " << elapsed << "]\n";
        std::cout << "[" << (isEqualNums(nums, sortedNums) ? "Correct" : "Uncorrect") << "]\n";
        std::cout << std::endl;
    }

    // Heap sort
    if (true)
    {
        std::vector<int> nums = originNums;
        et.restart();
        jcalgo_heap_sort_int(nums.data(), n);
        double elapsed = et.elapsedSec();
        if (printNums)
        {
            std::cout << "------------------------------\n";
            std::cout << "Heap sorted nums:\n------------------------------\n" << nums << "\n";
        }
        std::cout << "[Heap sort elapsed: " << elapsed << "]\n";
        std::cout << "[" << (isEqualNums(nums, sortedNums) ? "Correct" : "Uncorrect") << "]\n";
        std::cout << std::endl;
    }

    return 0;
}
