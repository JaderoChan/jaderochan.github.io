project(thread_pool_base_example LANGUAGES CXX)

set(SRCS ./main.cpp)
add_executable(${PROJECT_NAME} ${SRCS})
target_link_libraries(${PROJECT_NAME} PRIVATE thread_pool)
