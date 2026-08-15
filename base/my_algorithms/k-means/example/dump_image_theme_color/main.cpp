#include <cstdio>
#include <algorithm>
#include <iostream>
#include <string>

#include <kmeans.hpp>
#include "stb_image.h"

using namespace jcalgo::kmeans;

static void kmeansCallback(
    size_t currentEpoch, size_t totalEpoch, double globalCenterDelta,
    const KMeansResult& result, bool& stop, void* userdata)
{
    (void) result;
    (void) stop;
    (void) userdata;

    printf("Epoch: [%zu/%zu] Global center delta: %lf\n", currentEpoch, totalEpoch, globalCenterDelta);
}

static DoubleVectorList ucharToDoubleVectorList(
    const unsigned char* data, int width, int height, int channels)
{
    const size_t pixels = (size_t) width * (size_t) height;
    DoubleVectorList result;
    result.reserve(pixels);

    for (size_t i = 0; i < pixels; ++i)
    {
        std::vector<double> v(channels);
        const size_t base = i * (size_t) channels;

        for (int c = 0; c < channels; ++c)
            v[c] = (double) data[base + (size_t) c];

        result.emplace_back(std::move(v));
    }

    return result;
}

int main(int argc, char* argv[])
{
    std::string filepath;
    printf("Please input the image filepath:\n");
    std::cin >> filepath;

    // 读取图像数据
    DoubleVectorList datas;
    {
        int width = 0, height = 0, channels = 0;
        stbi_uc* d = stbi_load(filepath.c_str(), &width, &height, &channels, 3);
        if (!d)
        {
            printf("Failed to load the image: %s\n", filepath.c_str());
            return 1;
        }
        else
        {
            printf(
                "Successfully load the image: %s, image size: [%d, %d]\n",
                filepath.c_str(), width, height);
        }

        datas = ucharToDoubleVectorList(d, width, height, channels);
        stbi_image_free(d);
    }

    constexpr size_t     k = 5;
    constexpr size_t     totalEpoch = 100;
    constexpr double     esp = 1e-6;
    constexpr KMeansFlag flag = KMEANS_RANDOM_CENTER;
    auto result = kmeans(datas, k, flag, totalEpoch, esp, &kmeansCallback, nullptr);

    auto clusters = createClusters(datas, result);

    // 输出图像主题色
    std::sort(
        clusters.begin(), clusters.end(), [](const Cluster& lhs, const Cluster& rhs) -> bool
        { return lhs.datas.size() > rhs.datas.size(); });
    for (const auto& cluster : clusters)
    {
        const auto& center = cluster.center;
        printf(
            "RGB: [%d, %d, %d] Num: %zu\n",
            (int) center[0], (int) center[1], (int) center[2], cluster.datas.size());
    }

    return 0;
}
