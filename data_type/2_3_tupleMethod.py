# 元组的创建
tuple_A = ()
print(id(tuple_A))
print(type(tuple_A))
tuple_A = ('1')
print(id(tuple_A))
print(type(tuple_A))
tuple_A = (1, 'a', [25, 34, 43], True)
print(tuple_A)
# tuple_A[0] = 0  # 元组内元素不可修改（列表内的元素可以），但可以重新创建空间(内存位置变更)

# 元组的查询
for tuple_item in tuple_A:
    print(tuple_item, end="  ")
print()

print(tuple_A[:3])  # 切片
print(tuple_A[::-1])    # 步长为-1相当于索引为负值，即倒序排列
print(tuple_A[-3:-1:])   # 下标为负值即为原始下标的倒序（这里正索引从0到3，而负索引从-4到-1）
print(tuple_A[-1::])    # 获取最后一个元素的值

tuple_A[2][0] = "25"    # 修改元组中的列表元素
print(tuple_A)
