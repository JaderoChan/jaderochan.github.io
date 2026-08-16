project(dump_image_theme_color LANGUAGES C CXX)

set(SRCS main.cpp stb_image.c)
add_executable(${PROJECT_NAME} ${SRCS})
target_link_libraries(${PROJECT_NAME} PRIVATE kmeans)
