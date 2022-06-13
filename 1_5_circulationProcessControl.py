# while循环
# 输出1~100之间的整数

num = 0
while num < 100:
    num += 1
    print(num, end=", ")
print()

# 九九乘法表
# while实现
row = 0
while row < 9:
    row += 1
    col = 0
    while col < row:
        col += 1
        print("%d * %d = %d" % (col, row, col * row), end=" ")
    print()
# for实现
for i in range(1, 10):
    for j in range(1, i+1):
        print("%d * %d = %d" % (i, j, i*j), end="  ")
        # j += 1
    print()
    # i += 1 这里for循环参数不需要自增，range函数不设置步长默认自增1

# 打印直角三角形

i = 0
while i < 9:
    i += 1
    j = 0
    while j < i:
        j += 1
        print("*", end="  ")  # 阻止print的默认换行并替换为引号内容
    print()  # 这里print()可以直接当换行符用

# 打印等腰三角形
'''
先打印等腰三角形左侧的空格
再根据行数判断每行需要打印点的数量
本质上等腰三角形是被两个倒过来的直角三角形夹在中间
'''
i = 0
while i < 9:
    i += 1
    j = 9
    k = 0
    while j >= i:
        j -= 1
        print(" ", end="  ")
    while k < 2*i-1:
        k += 1
        print("*", end="  ")
    print()

# for循环
character_set = "Python"    # 字符串类型是字符类型的集合
for single_char in character_set:
    print(single_char)
# range函数可以生成数据集合列表
# range(起始：结束：步长) 步长不能为0，包含起始不包含结束
for data_item in range(1, 101):
    print(data_item, end="  ")
print()

# 判断奇偶
for data_item in range(198, 201):
    if data_item % 2 == 0:
        print("偶数：%d" % data_item)
    else:
        print("奇数：%d" % data_item)

# for…else…
for items in range(1, 11):
    print("%d" % items, end=" ")
    if items == 5:
        break
else:
    print("Completed.")
