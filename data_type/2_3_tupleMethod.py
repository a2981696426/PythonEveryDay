# 元组的创建
tuple_A = ()
print(tuple_A)
print(type(tuple_A))
tuple_A = ('1')
print(tuple_A)
print(type(tuple_A))
tuple_A = (1, 'a', [25, 34, 43], True)
print(tuple_A)
# tuple_A[0] = 0  # 元组不可修改，但可以重新创建空间

# 元组的查询
for tuple_item in tuple_A:
    print(tuple_item, end="  ")
print()

print(tuple_A[:3])  # 切片
