const path = require('path');
const ffi = require('ffi-napi');
const ref = require('ref-napi');

// 创建一个简单的测试函数
function testFFI() {
    try {
        // 使用完整的路径加载系统库
        const libc = ffi.Library(path.join(process.resourcesPath, 'node_modules/ffi-napi/build/Release/ffi_bindings.node'), {
            'printf': ['int', ['string']]
        });

        // 调用 printf 函数
        const result = libc.printf('Hello from FFI!\n');
        document.getElementById('result').innerHTML = `FFI 调用成功！返回值: ${result}`;
    } catch (error) {
        document.getElementById('result').innerHTML = `FFI 调用失败：${error.message}`;
        console.error('FFI Error:', error);
    }
}

// 添加按钮点击事件监听器
document.getElementById('testFFI').addEventListener('click', testFFI); 