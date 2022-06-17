str_word = "Python is the best language in the world."


# 首字母大小写转换

str_capitalize = "nick_Chen"
str_withoutInitials = " nick_Chen"  # 若首字符非字母，则其余字母小写
print("Name: %s" % str_capitalize.capitalize())
print("Name: %s" % str_withoutInitials.capitalize())


# 去除字符串空格

print("%s" % str_word.strip())
print("Name: %s" % str_withoutInitials.lstrip())    # 删除左边的空格

# 查看对象内存地址
print("Str_word memory address: %s" % id(str_word))
str_id = str_word   # 复制是将str_world的内存地址赋值给str_id
print("Str_id memory address: %s, and str_id's value: %s" % (id(str_id), str_id))

# 检测字符串是否包含字符，若包含则返回下标，否则返回-1
print(str_word.find(' '))
print(str_word.index('i'))  # index和find基本相同，但index不包含抛出异常

# 检测字符串是否以检索值开始/结束
print(str_word.startswith('P'))
print(str_word.endswith('d'))

# 字符串大小写的转换
print(str_word.lower())
print(str_word.upper())

# 切片——截取字符串中内容
print(str_word[2:5:2])  # 从索引2到5，每隔2个字符取出一个字符
print(str_word[6:])
print(str_word[:6])
print(str_word[::-1])   # 步长为-1时，截取内容倒序输出（负号表示从右往左遍历）