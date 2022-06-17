list_example = [1, 2, 3, "Hello", True]
list_world = "Python"   # 字符串也是列表

# 获取list中数据项数量
print("Number of data items in the list_example is %d." % len(list_example))
print("Number of data items in the list_world is %d." % len(list_world))

# 获取list类型
print("%s" % type(list_example))
print("%s" % type(list_world))

# 切片
print(list_example)
print(list_example[0])  # 输出第一个元素
print(list_example[3:4])    # 输出第四个元素（范围包含开始不包含结束）
print(list_example[::-1])   # 元素从右向左输出
print(list_example*2)   # 元素循环输出

print("---------------------------------------------------------")
# 增加元素
list_example.append([4, 5])
print(list_example)
list_example.insert(0, "This is the data I just inserted.") # 需要指定位置
print(list_example)

range_num = list(range(10)) # 强制转换为list
list_example.extend(range_num)  # 扩展，相当于批量添加
print(list_example)

print("---------------------------------------------------------")
print("Before: ", list_example)
list_example[0] = 0 # 修改
print("After: ", list_example)

print("---------------------------------------------------------")
range_50 = list(range(50))
del range_50[0] # 删除列表中第一个元素
print(range_50)
del range_50[0:9]   # 使用切片(slice)批量删除
print(range_50)
range_50.remove(34) # 移除指定元素，参数是具体数据值
print(range_50)
range_50.pop(0) # 移除指定项，参数是索引值
print(range_50)

print("---------------------------------------------------------")
print(range_50.index(25)) # 返回数据项索引值