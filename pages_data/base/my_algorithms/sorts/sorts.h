#ifndef JCALGO_SORTS_H
#define JCALGO_SORTS_H

#include <stddef.h> // size_t
#include <stdlib.h> // malloc, free

#ifndef JCALGO_LESS_THAN
    #define JCALGO_LESS_THAN(a, b) ((a) < (b))
#endif // !JCALGO_LESS_THAN

#ifndef _JCALGO_SWAP
    #define _JCALGO_SWAP(T, a, b) do { const T t = (a); (a) = (b); (b) = t; } while(0)
#endif // !_JCALGO_SWAP

/** @brief 冒泡排序 */
#define JCALGO_DEFINE_BUBBLE_SORT(T, COMP)                                      \
void jcalgo_bubble_sort_##T(T *arr, size_t n)                                   \
{                                                                               \
    if (n < 2)                                                                  \
        return;                                                                 \
                                                                                \
    n -= 1;                                                                     \
    int has_swap = 1;                                                           \
    while (has_swap)                                                            \
    {                                                                           \
        has_swap = 0;                                                           \
        for (size_t i = 0; i < n; ++i)                                          \
        {                                                                       \
            if (COMP(arr[i + 1], arr[i]))                                       \
            {                                                                   \
                _JCALGO_SWAP(T, arr[i], arr[i + 1]);                            \
                has_swap = 1;                                                   \
            }                                                                   \
        }                                                                       \
    }                                                                           \
}

/** @brief 选择排序 */
#define JCALGO_DEFINE_SELECT_SORT(T, COMP)                                      \
void jcalgo_select_sort_##T(T *arr, size_t n)                                   \
{                                                                               \
    if (n < 2)                                                                  \
        return;                                                                 \
                                                                                \
    for (size_t i = 0; i < n; ++i)                                              \
    {                                                                           \
        size_t flag = i;                                                        \
        for (size_t j = i + 1; j < n; ++j)                                      \
        {                                                                       \
            if (COMP(arr[j], arr[flag]))                                        \
                flag = j;                                                       \
        }                                                                       \
        _JCALGO_SWAP(T, arr[i], arr[flag]);                                     \
    }                                                                           \
}

/** @brief 插入排序 */
#define JCALGO_DEFINE_INSERT_SORT(T, COMP)                                      \
void jcalgo_insert_sort_##T(T *arr, size_t n)                                   \
{                                                                               \
    if (n < 2)                                                                  \
        return;                                                                 \
                                                                                \
    for (size_t i = 1; i < n; ++i)                                              \
    {                                                                           \
        size_t flag = i;                                                        \
        for (size_t j = i - 1; j >= 0;)                                         \
        {                                                                       \
            if (!COMP(arr[flag], arr[j]))                                       \
                break;                                                          \
                                                                                \
            _JCALGO_SWAP(T, arr[j], arr[flag]);                                 \
            --flag;                                                             \
            if (j > 0) --j;                                                     \
            else       break;                                                   \
        }                                                                       \
    }                                                                           \
}

/** @brief 希尔排序 */
#define JCALGO_DEFINE_SHELL_SORT(T, COMP)                                       \
void jcalgo_shell_sort_##T(T *arr, size_t n)                                    \
{                                                                               \
    if (n < 2)                                                                  \
        return;                                                                 \
                                                                                \
    size_t gap = n / 2;                                                         \
    while (gap)                                                                 \
    {                                                                           \
        for (size_t g = 0; g < gap; ++g)                                        \
        {                                                                       \
            for (size_t i = g + gap; i < n; i += gap)                           \
            {                                                                   \
                size_t flag = i;                                                \
                for (size_t j = i - gap; j >= 0;)                               \
                {                                                               \
                    if (!COMP(arr[flag], arr[j]))                               \
                        break;                                                  \
                                                                                \
                    _JCALGO_SWAP(T, arr[j], arr[flag]);                         \
                    flag -= gap;                                                \
                    if (j > g) j -= gap;                                        \
                    else       break;                                           \
                }                                                               \
            }                                                                   \
        }                                                                       \
                                                                                \
        gap /= 2;                                                               \
    }                                                                           \
}

/** @brief 归并排序 */
#define JCALGO_DEFINE_MERGE_SORT(T, COMP)                                       \
void _jcalgo_merge_sort_impl_##T(T *arr, T *tmp, size_t n)                      \
{                                                                               \
    if (n < 2)                                                                  \
        return;                                                                 \
                                                                                \
    size_t mid = n / 2;                                                         \
    _jcalgo_merge_sort_impl_##T(arr,       tmp, mid);                           \
    _jcalgo_merge_sort_impl_##T(arr + mid, tmp, n - mid);                       \
                                                                                \
    size_t i = 0, j = mid, k = 0;                                               \
    while (i < mid && j < n)                                                    \
    {                                                                           \
        if (COMP(arr[j], arr[i])) tmp[k++] = arr[j++];                          \
        else                      tmp[k++] = arr[i++];                          \
    }                                                                           \
    while (i < mid) tmp[k++] = arr[i++];                                        \
    while (j < n)   tmp[k++] = arr[j++];                                        \
    for (size_t m = 0; m < n; ++m) arr[m] = tmp[m];                             \
}                                                                               \
                                                                                \
void jcalgo_merge_sort_##T(T *arr, size_t n)                                    \
{                                                                               \
    if (n < 2)                                                                  \
        return;                                                                 \
                                                                                \
    T *tmp = (T *)malloc(n * sizeof(T));                                        \
    if (!tmp)                                                                   \
        return;                                                                 \
                                                                                \
    _jcalgo_merge_sort_impl_##T(arr, tmp, n);                                   \
    free(tmp);                                                                  \
}

/** @brief 快速排序 */
#define JCALGO_DEFINE_QUICK_SORT(T, COMP)                                       \
void jcalgo_quick_sort_##T(T *arr, size_t n)                                    \
{                                                                               \
    if (n < 2)                                                                  \
        return;                                                                 \
                                                                                \
    T pivot = arr[n / 2];                                                       \
    size_t i = 0, j = n - 1;                                                    \
                                                                                \
    while (i <= j)                                                              \
    {                                                                           \
        while (i < n && COMP(arr[i], pivot))  ++i;                              \
        while (j > 0 && COMP(pivot,  arr[j])) --j;                              \
        if (i <= j)                                                             \
        {                                                                       \
            _JCALGO_SWAP(T, arr[i], arr[j]);                                    \
            ++i;                                                                \
            if (j > 0) --j;                                                     \
            else       break;                                                   \
        }                                                                       \
    }                                                                           \
                                                                                \
    if (i < n) jcalgo_quick_sort_##T(arr + i, n - i);                           \
    if (j > 0) jcalgo_quick_sort_##T(arr,     j + 1);                           \
}

/** @brief 堆排序 */
#define JCALGO_DEFINE_HEAP_SORT(T, COMP)                                        \
void _jcalgo_heap_sort_sift_down_##T(T *arr, size_t n, size_t i)                \
{                                                                               \
    while (true)                                                                \
    {                                                                           \
        const size_t l = 2 * i + 1;                                             \
        const size_t r = 2 * i + 2;                                             \
        size_t flag = i;                                                        \
        if (l < n && !COMP(arr[l], arr[flag])) flag = l;                        \
        if (r < n && !COMP(arr[r], arr[flag])) flag = r;                        \
        if (flag == i) break;                                                   \
        _JCALGO_SWAP(T, arr[i], arr[flag]);                                     \
        i = flag;                                                               \
    }                                                                           \
}                                                                               \
                                                                                \
void jcalgo_heap_sort_##T(T *arr, size_t n)                                     \
{                                                                               \
    if (n < 2)                                                                  \
        return;                                                                 \
                                                                                \
    for (size_t i = (n - 1) / 2; i >= 0;)                                       \
    {                                                                           \
        _jcalgo_heap_sort_sift_down_##T(arr, n, i);                             \
        if (i > 0) --i;                                                         \
        else       break;                                                       \
    }                                                                           \
                                                                                \
    for (size_t i = n - 1; i > 0;)                                              \
    {                                                                           \
        _JCALGO_SWAP(T, arr[0], arr[i]);                                        \
        _jcalgo_heap_sort_sift_down_##T(arr, i, 0);                             \
        if (i > 0) --i;                                                         \
        else       break;                                                       \
    }                                                                           \
}

#endif // !JCALGO_SORTS_H
