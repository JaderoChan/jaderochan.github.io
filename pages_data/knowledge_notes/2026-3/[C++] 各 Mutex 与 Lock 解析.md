# [C++] 各 Mutex 与 Lock 解析

## Mutex

| Mutex | 引入版本 | 头文件 | 特点 | 使用场景 |
| --- | --- | --- | --- | --- |
| `std::mutex` | C++11 | `<mutex>` | 基础互斥体；排他锁；同一时刻只有一个线程能获得锁；不可递归；开销最小 | 保护简单共享数据 |
| `std::recursive_mutex` | C++11 | `<mutex>` | 允许同一线程多次加锁；内部维护锁计数；需要加锁和解锁次数相同；开销中等 | 递归函数需要加锁；重入函数；避免死锁 |
| `std::timed_mutex` | C++11 | `<mutex>` | 支持超时加锁；不可递归；方法：`try_lock_for()`、`try_lock_until()`；开销中等 | 防止线程无限等待；死锁检测；需要响应式的锁获取 |
| `std::recursive_timed_mutex` | C++11 | `<mutex>` | 结合递归和超时特性；支持 `try_lock_for()`；开销最大 | 既需要递归又需要超时 |
| `std::shared_mutex` | C++17 | `<shared_mutex>` | 读写分离；多线程可同时读（共享锁）；写操作排他；方法：`lock()/unlock()`、`lock_shared()/unlock_shared()`；开销中等 | 读多写少场景（缓存、配置）；性能要求高的读操作 |
| `std::shared_timed_mutex` | C++14 | `<shared_mutex>` | 结合读写分离和超时特性；支持超时读写；方法：`try_lock_for()`、`try_lock_shared_for()`；开销最大 | 既需要读写分离又需要超时 |

## Lock

| 特性 | `std::lock_guard` | `std::unique_lock` | `std::scoped_lock` |
| --- | --- | --- | --- |
| 引入版本 | C++11 | C++11 | C++17 |
| 锁定单个互斥体 | ✔ | ✔ | ✔ |
| 锁定多个互斥体 | ✖ | ✖ | ✔ |
| 手动 lock/unlock | ✖ | ✔ | ✖ |
| 定时加锁 | ✖ | ✔ | ✖ |
| try_lock | ✖ | ✔ | ✖ |
| 多互斥体死锁安全 | ✖ | ✖ | ✔ |
| 可移动(move) | ✖ | ✔ | ✖ |

---

**使用场景**：

```cpp
std::mutex m;

// 1. lock_guard：简单场景，锁定单个互斥体
{
    std::lock_guard<std::mutex> lock(m);
    // 临界区
}

// 2. unique_lock：需要灵活控制，手动加/解锁
std::unique_lock<std::mutex> lock(m);
// 临界区
lock.unlock();

// 非临界区

lock.lock();
// 临界区
lock.unlock();

// 3. scoped_lock：安全地锁定多个互斥体
std::mutex m1, m2;
{
    std::scoped_lock lock(m1, m2);  // 原子性地锁定两个互斥体
    // 临界区，没有死锁风险
}
```
