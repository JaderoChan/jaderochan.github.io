project(sort_algorithms_benchmark LANGUAGES CXX)

set(SRCS main.cpp)
add_executable(${PROJECT_NAME} ${SRCS})
target_link_libraries(${PROJECT_NAME} PRIVATE sorts)
