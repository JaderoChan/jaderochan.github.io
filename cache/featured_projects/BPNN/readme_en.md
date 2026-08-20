# BP Neural Network

[[中文简体](./README.md) | **English**]

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](https://github.com/JaderoChan/BPNN)

> This document was translated by AI.

A three-layer fully-connected BP neural network library implemented in pure C99, with no third-party dependencies, created for learning purposes.

> **Available enumeration**
>
> - **Activation functions**: Sigmoid, Tanh, ReLU, Leaky ReLU, Softmax, Linear
> - **Loss functions**：CCE (Categorical Cross Entropy), BCE (Binary cross entropy), MSE (Mean square error)

For formula derivations, see [BP Neural Network Formula Derivation](./docs/BP%20Neural%20Network%20Formula%20Derivation.md).

## Features

- Zero dependencies, standard C library only
- Provides common types of activation functions and loss functions to meet the needs of a variety of tasks
- Forward and backward propagation fully decoupled — each step can be called independently
- Model parameter saving and loading support
- Training supports custom callbacks for real-time loss monitoring

## Quick Start

### Build the Library

```sh
git clone https://github.com/JaderoChan/bpnn.git
cd bpnn
cmake -B build -DCMAKE_BUILD_TYPE=Release -DBPNN_BUILD_EXAMPLE=OFF
cmake --build build -j --config=Release
```

### Build the Example

To build the example program, first extract the dataset archives under `./example/digit_recognizer/data_set/`, then enable the option:

```sh
cmake -B build -DCMAKE_BUILD_TYPE=Release -DBPNN_BUILD_EXAMPLE=ON
cmake --build build -j --config=Release
```

> **Note**: The `curve_fitting` and `digit_recognizer_gui` examples require **Qt** (Qt5 or Qt6).

## API Overview

### Parameter Management

| Function | Description |
| --- | --- |
| `bpnn_params_construct_v1()` | Create BP neural network parameters (weights and biases initialized to 0) |
| `bpnn_params_construct_v2()` | Create BP neural network parameters (with specified initial weights and biases) |
| `bpnn_params_randomize()` | Xavier random initialization of weights |
| `bpnn_params_save_to_file()` | Save BP neural network parameters to file |
| `bpnn_params_load_from_file()` | Load BP neural network parameters from file |
| `bpnn_params_destroy()` | Free BP neural network parameter memory |

### Training and Inference

```c
// Train
bool bpnn_train(
    bpnn_params_t* params,
    const double* ins_samples, const double* labels_samples, uint32_t sample_num,
    double learn_rate, bpnn_loss_fn_t loss_fn, uint32_t epoch_num, double esp,
    bpnn_train_sample_callback_t sample_callback, void* sc_userdata,
    bpnn_train_epoch_callback_t  epoch_callback,  void* ec_userdata);

// Inference and predict
bool bpnn_predict(const bpnn_params_t* params, const double* ins, double* outs);
```

## Example

### BPNN Digit Recognizer

An MNIST handwritten digit recognition program built on this library (Use the Sigmoid function as the hidden layer activation function, Softmax as the output layer activation function, and Categorical Cross Entropy as the loss function.), achieving **98%** accuracy after 50 training epochs. See [BPNN Digit Recognizer](./example/digit_recognizer/README_EN.md).

### BPNN Curve Fitting

A curve fitting GUI program built on this library (1-N-1 network, configurable hidden layer activation function, Linear output activation, MSE loss function), featuring real-time training visualization and interactive scatter point management. See [BPNN Curve Fitting](./example/curve_fitting/README_EN.md).
