cmake_minimum_required(VERSION 3.16)

project(thread_pool LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(HEADERS ./thread_pool.hpp)
set(SRCS ./thread_pool.cpp)
set(PROJECT_SOURCES ${HEADERS} ${SRCS})

add_library(${PROJECT_NAME} ${PROJECT_SOURCES})
target_include_directories(${PROJECT_NAME} PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

add_subdirectory(./example)
