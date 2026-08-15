#include "kmeans.hpp"

#include <random>

namespace jcalgo
{

namespace kmeans
{

DoubleVector operator+(const DoubleVector& lhs, const DoubleVector& rhs)
{
    if (lhs.size() != rhs.size())
        throw std::runtime_error("Cannot operate on two vectors of different dimension sizes");

    DoubleVector result = lhs;
    for (size_t i = 0; i < lhs.size(); ++i)
        result[i] += rhs[i];
    return result;
}

DoubleVector operator+(const DoubleVector& lhs, double rhs)
{
    DoubleVector result = lhs;
    for (size_t i = 0; i < lhs.size(); ++i)
        result[i] += rhs;
    return result;
}

DoubleVector operator-(const DoubleVector& lhs, const DoubleVector& rhs)
{
    if (lhs.size() != rhs.size())
        throw std::runtime_error("Cannot operate on two vectors of different dimension sizes");

    DoubleVector result = lhs;
    for (size_t i = 0; i < lhs.size(); ++i)
        result[i] -= rhs[i];
    return result;
}

DoubleVector operator-(const DoubleVector& lhs, double rhs)
{
    DoubleVector result = lhs;
    for (size_t i = 0; i < lhs.size(); ++i)
        result[i] -= rhs;
    return result;
}

DoubleVector operator*(const DoubleVector& lhs, double rhs)
{
    DoubleVector result = lhs;
    for (size_t i = 0; i < lhs.size(); ++i)
        result[i] *= rhs;
    return result;
}

DoubleVector operator/(const DoubleVector& lhs, double rhs)
{
    DoubleVector result = lhs;
    for (size_t i = 0; i < lhs.size(); ++i)
        result[i] /= rhs;
    return result;
}

DoubleVector& operator+=(DoubleVector& lhs, const DoubleVector& rhs)
{
    if (lhs.size() != rhs.size())
        throw std::runtime_error("Cannot operate on two vectors of different dimension sizes");

    for (size_t i = 0; i < lhs.size(); ++i)
        lhs[i] += rhs[i];
    return lhs;
}

DoubleVector& operator+=(DoubleVector& lhs, double rhs)
{
    for (size_t i = 0; i < lhs.size(); ++i)
        lhs[i] += rhs;
    return lhs;
}

DoubleVector& operator-=(DoubleVector& lhs, const DoubleVector& rhs)
{
    if (lhs.size() != rhs.size())
        throw std::runtime_error("Cannot operate on two vectors of different dimension sizes");

    for (size_t i = 0; i < lhs.size(); ++i)
        lhs[i] -= rhs[i];
    return lhs;
}

DoubleVector& operator-=(DoubleVector& lhs, double rhs)
{
    for (size_t i = 0; i < lhs.size(); ++i)
        lhs[i] -= rhs;
    return lhs;
}

DoubleVector& operator*=(DoubleVector& lhs, double rhs)
{
    for (size_t i = 0; i < lhs.size(); ++i)
        lhs[i] *= rhs;
    return lhs;
}

DoubleVector& operator/=(DoubleVector& lhs, double rhs)
{
    for (size_t i = 0; i < lhs.size(); ++i)
        lhs[i] /= rhs;
    return lhs;
}

KMeansResult kmeans(
    const DoubleVectorList& datas, const DoubleVectorList& originCenters,
    size_t totalEpoch, double esp, KMeansCallback callback, void* userdata)
{
    if (datas.empty() || originCenters.empty())
        return KMeansResult();
    const size_t n = datas.size(), dim = datas.front().size(), k = originCenters.size();
    if (originCenters.front().size() != dim)
        return KMeansResult();

    // 用于随机选择任意一个数据作为簇中心，以防止空簇更新中心时产生除零错误。
    std::mt19937 rng(std::random_device{}());
    std::uniform_int_distribution<size_t> pickAny(0, n - 1);

    // 初始化聚类结果
    KMeansResult result;
    auto& centers    = result.centers;
    auto& centerIdxs = result.centerIdxs;
    centers = originCenters;
    centerIdxs.resize(n, 0);

    bool stop = false;
    DoubleVector lastGlobalCenter;
    for (size_t epoch = 0; epoch < totalEpoch && !stop; ++epoch)
    {
        // 遍历所有数据并将其分配到距离最近的簇。
        for (size_t i = 0; i < n; ++i)
        {
            // 计算距离最近的簇距离与簇索引。
            double nearestDist = +INFINITY;
            size_t nearestIdx  = 0;
            for (size_t j = 0; j < k; ++j)
            {
                const double dist = vectorDistance(datas[i], centers[j]);
                if (dist < nearestDist)
                {
                    nearestDist = dist;
                    nearestIdx  = j;
                }
            }

            // 将数据分配到距离最近的簇中。
            centerIdxs[i] = nearestIdx;
        }

        // 重计算各个簇的中心
        centers = DoubleVectorList(k, DoubleVector(dim, 0.0));
        std::vector<size_t> clusterSize(k, 0);

        for (size_t i = 0; i < n; ++i)
        {
            centers[centerIdxs[i]] += datas[i];
            clusterSize[centerIdxs[i]]++;
        }

        for (size_t i = 0; i < k; ++i)
        {
            if (clusterSize[i] == 0)
            {
                centers[i] = datas[pickAny(rng)];
                continue;
            }
            centers[i] /= (double) clusterSize[i];
        }

        // 计算全局中心的偏移量
        DoubleVector globalCenter(dim, 0.0);
        for (size_t i = 0; i < k; ++i)
            globalCenter += centers[i];
        globalCenter /= (double) k;

        const double delta =
            lastGlobalCenter.empty() ?
            NAN :
            vectorDistance(globalCenter, lastGlobalCenter);
        lastGlobalCenter = globalCenter;

        // 回调函数
        if (callback)
            callback(epoch, totalEpoch, delta, result, stop, userdata);

        // 判断是否到达指定精度
        if (delta < esp)
            break;
    }

    return result;
}

KMeansResult kmeans(
    const DoubleVectorList& datas, size_t k, KMeansFlag flag,
    size_t totalEpoch, double esp, KMeansCallback callback, void* userdata)
{
    if (datas.empty() || k <= 1)
        return KMeansResult();

    DoubleVectorList originCenters;
    originCenters.reserve(k);

    std::mt19937 rng(std::random_device{}());
    std::uniform_int_distribution<size_t> pickAny(0, datas.size() - 1);

    switch (flag)
    {
        case KMEANS_RANDOM_CENTER:
        {
            for (size_t i = 0; i < k; ++i)
                originCenters.push_back(datas[pickAny(rng)]);
            break;
        }
        case KMEANS_PP_CENTER:
        {
            originCenters.push_back(datas[pickAny(rng)]);

            std::vector<double> minDistSq(datas.size(), +INFINITY);
            while (originCenters.size() < k)
            {
                double totalWeight = 0.0;
                for (size_t i = 0; i < datas.size(); ++i)
                {
                    const double dist   = vectorDistance(datas[i], originCenters.back());
                    const double distSq = dist * dist;
                    if (distSq < minDistSq[i])
                        minDistSq[i] = distSq;
                    totalWeight += minDistSq[i];
                }

                if (!(totalWeight > 0.0) || !std::isfinite(totalWeight))
                {
                    originCenters.push_back(datas[pickAny(rng)]);
                    continue;
                }

                std::discrete_distribution<size_t> pickByWeight(minDistSq.begin(), minDistSq.end());
                originCenters.push_back(datas[pickByWeight(rng)]);
            }
            break;
        }
    }

    return kmeans(datas, originCenters, totalEpoch, esp, callback, userdata);
}

KMeansResult kmeans(
    const DoubleVectorList& datas, size_t k, KMeansFlag flag,
    size_t totalEpoch, double esp, size_t attempt, KMeansCallback callback, void* userdata)
{
    if (datas.empty() || k <= 1)
        return KMeansResult();

    if (attempt == 0)
        attempt = 1;

    KMeansResult bestResult;
    double bestScore = -INFINITY;
    for (size_t i = 0; i < attempt; ++i)
    {
        const KMeansResult result = kmeans(datas, k, flag, totalEpoch, esp, callback, userdata);
        const double score = calinskiHarabaszScore(createClusters(datas, result));
        if (score > bestScore)
        {
            bestScore = score;
            bestResult = result;
        }
    }

    return bestResult;
}

ClusterList createClusters(const DoubleVectorList& datas, const KMeansResult& result)
{
    if (datas.size() != result.centerIdxs.size())
        return ClusterList();

    const size_t k = result.centers.size();
    ClusterList clusters(k, Cluster());

    for (size_t i = 0; i < k; ++i)
        clusters[i].center = result.centers[i];

    for (size_t i = 0; i < datas.size(); ++i)
    {
        const size_t idx = result.centerIdxs[i];
        clusters[idx].datas.push_back(datas[i]);
    }

    return clusters;
}

double calinskiHarabaszScore(const ClusterList& clusters)
{
    const size_t k = clusters.size();
    size_t n = 0;
    for (const auto& cluster : clusters)
        n += cluster.datas.size();

    if (k <= 1 || n <= k)
        return 0.0;

    const size_t dim = clusters.front().center.size();

    // 计算全局中心
    DoubleVector globalCenter(dim, 0.0);
    {
        for (const auto& cluster : clusters)
            globalCenter += cluster.center;
        globalCenter /= (double) k;
    }

    // 计算类间离散度 SS_B
    double ssB = 0.0;
    for (const auto& cluster : clusters)
    {
        const double dist = vectorDistance(cluster.center, globalCenter);
        ssB += (double) cluster.datas.size() * dist * dist;
    }

    // 计算类内离散度 SS_W
    double ssW = 0.0;
    for (const auto& cluster : clusters)
    {
        for (const auto& data : cluster.datas)
        {
            const double dist = vectorDistance(data, cluster.center);
            ssW += dist * dist;
        }
    }

    // 类内所有数据都聚集在簇中心，此时类内离散度 SS_W 为 0.0，返回正无穷指示到达理想情况。
    if (ssW == 0.0)
        return +INFINITY;

    return (ssB / ssW) * ((double) (n - k) / (double) (k - 1));
}

} // namespace kmeans

} // namespace jcalgo
