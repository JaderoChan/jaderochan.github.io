#ifndef JCALGO_KMEANS_HPP
#define JCALGO_KMEANS_HPP

#include <cstddef>
#include <cmath>
#include <stdexcept>
#include <vector>

namespace jcalgo
{

namespace kmeans
{

/** @brief 一个多维向量，向量维度数为 std::vector<T>::size() */
using DoubleVector     = std::vector<double>;
/** @brief 一组多维向量 */
using DoubleVectorList = std::vector<std::vector<double>>;

/** @brief 计算向量距离 */
template <typename T>
double vectorDistance(const std::vector<T>& lhs, const std::vector<T>& rhs)
{
    if (lhs.size() != rhs.size())
        throw std::runtime_error("Cannot operate on two vectors of different dimension sizes");

    double sum = 0.0;
    const size_t dim = lhs.size();
    for (size_t i = 0; i < dim; ++i)
        sum += (lhs[i] - rhs[i]) * (lhs[i] - rhs[i]);
    return sqrt(sum);
}

DoubleVector  operator+(const DoubleVector& lhs, const DoubleVector& rhs);
DoubleVector  operator+(const DoubleVector& lhs, double rhs);
DoubleVector  operator-(const DoubleVector& lhs, const DoubleVector& rhs);
DoubleVector  operator-(const DoubleVector& lhs, double rhs);
DoubleVector  operator*(const DoubleVector& lhs, double rhs);
DoubleVector  operator/(const DoubleVector& lhs, double rhs);
DoubleVector& operator+=(DoubleVector& lhs, const DoubleVector& rhs);
DoubleVector& operator+=(DoubleVector& lhs, double rhs);
DoubleVector& operator-=(DoubleVector& lhs, const DoubleVector& rhs);
DoubleVector& operator-=(DoubleVector& lhs, double rhs);
DoubleVector& operator*=(DoubleVector& lhs, double rhs);
DoubleVector& operator/=(DoubleVector& lhs, double rhs);

/** @brief K-Means 聚类结果 */
struct KMeansResult
{
    DoubleVectorList    centers;    /**< 聚类中心列表 */
    std::vector<size_t> centerIdxs; /**< 每个输入数据对应的聚类中心索引 */
};

/** @brief K-Means 初始中心选择策略 */
enum KMeansFlag
{
    KMEANS_RANDOM_CENTER, /**< 使用随机中心 */
    KMEANS_PP_CENTER      /**< 使用 K-Means++ 中心 */
};

/**
 * @brief K-Means 聚类回调函数
 * @param currentEpoch 当前迭代轮数
 * @param totalEpoch   总迭代轮数
 * @param centerDelta  全局中心偏移量
 * @param result       本轮聚类结果
 * @param stop         是否停止聚类
 * @param userdata     用户自定义指针
 */
using KMeansCallback = void (*)(
    size_t currentWpoch, size_t totalEpoch, double globalCenterDelta,
    const KMeansResult& result, bool& stop, void* userdata);

/**
 * @brief 使用给定初始中心执行 K-Means 聚类
 * @param datas         输入数据集，每个元素都是一个维度一致的样本向量
 * @param originCenters 初始聚类中心列表，其维度必须与输入样本一致
 * @param totalEpoch    最大迭代轮数
 * @param esp           提前停止阈值，当连续两轮全局中心偏移量小于该值时停止
 * @param callback      每轮迭代结束后的回调函数，可为 nullptr
 * @param userdata      透传给回调函数的用户自定义指针，可为 nullptr
 * @return 聚类结果，当输入数据为空、初始中心为空或维度不匹配时返回空结果
 */
KMeansResult kmeans(
    const DoubleVectorList& datas, const DoubleVectorList& originCenters,
    size_t totalEpoch, double esp, KMeansCallback callback, void* userdata);

/**
 * @brief 按指定策略生成初始中心后执行 K-Means 聚类
 * @param datas      输入数据集，每个元素都是一个维度一致的样本向量
 * @param k          聚类中心数量
 * @param flag       初始中心生成策略，支持随机中心和 K-Means++ 中心
 * @param totalEpoch 最大迭代轮数
 * @param esp        提前停止阈值，当连续两轮全局中心偏移量小于该值时停止
 * @param callback   每轮迭代结束后的回调函数，可为 nullptr
 * @param userdata   透传给回调函数的用户自定义指针，可为 nullptr
 * @return 聚类结果；当输入数据为空或 k 小于等于 1 时返回空结果
 */
KMeansResult kmeans(
    const DoubleVectorList& datas, size_t k, KMeansFlag flag,
    size_t totalEpoch, double esp, KMeansCallback callback, void* userdata);

/**
 * @brief 多次执行带初始化策略的 K-Means，并返回评分最优的结果
 * @param datas      输入数据集，每个元素都是一个维度一致的样本向量
 * @param k          聚类中心数量
 * @param flag       初始中心生成策略，支持随机中心和 K-Means++ 中心
 * @param totalEpoch 单次运行的最大迭代轮数
 * @param esp        单次运行的提前停止阈值
 * @param attempt    尝试次数；当传入 0 时会按 1 次处理
 * @param callback   每轮迭代结束后的回调函数，可为 nullptr
 * @param userdata   透传给回调函数的用户自定义指针，可为 nullptr
 * @return Calinski-Harabasz 指标最优的聚类结果；当输入数据为空或 k 小于等于 1 时返回空结果
 */
KMeansResult kmeans(
    const DoubleVectorList& datas, size_t k, KMeansFlag flag,
    size_t totalEpoch, double esp, size_t attempt, KMeansCallback callback, void* userdata);

/** @brief 数据簇 */
struct Cluster
{
    DoubleVector     center;
    DoubleVectorList datas;
};

/** @brief 数据簇列表 */
using ClusterList = std::vector<Cluster>;

/** @brief 根据给定参数构造数据簇列表 */
ClusterList createClusters(const DoubleVectorList& datas, const KMeansResult& result);

/** @brief 计算数据簇列表的 CH 指标，用以衡量聚类效果：结果越大，聚类效果越好 */
double calinskiHarabaszScore(const ClusterList& clusters);

} // namespace kmeans

} // namespace jcalgo

#endif // !JCALGO_KMEANS_HPP
