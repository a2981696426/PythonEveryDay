# 输出 %：占位符，后面跟的是变量类型
lang = 'Python'
adj = 'best'
year = 2022
print("In %d,%s is the %s language in the world." % (year, lang, adj))

# format形式
print("In {},{} is the {} language in the world.".format(year, lang, adj))

# input获取键盘输入和类型转换
lang = input("Programming language:")
adj = input("Adjective:")
year = int(input("Timing:"))  # str转int
print("In %d,%s is the %s language in the world." % (year, lang, adj))
