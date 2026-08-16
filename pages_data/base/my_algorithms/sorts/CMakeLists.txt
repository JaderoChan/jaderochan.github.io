cmake_minimum_required(VERSION 3.17)

project(sorts LANGUAGES C)
set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)

if(MSVC)
    add_compile_options(/utf-8)
endif()

set(SRCS sorts.h)
add_library(${PROJECT_NAME} INTERFACE ${SRCS})
target_include_directories(${PROJECT_NAME} INTERFACE ${CMAKE_CURRENT_SOURCE_DIR})

add_subdirectory(example)
