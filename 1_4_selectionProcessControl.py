import random

# 单分支
# if条件表达式：比较运算符、逻辑运算符等

score = int(input("Your final exam score:"))
if score < 60:
    print("Grade D")
    pass  # 空语句
print("End.")

# 双分支
# if……else……

if score < 60:
    print("FAIL.")
    pass
else:
    print("PASS.")
    pass

# 多分支
# if……elif……else……
'''
特征：
1.elif后必须有条件和语句
2.else可选
'''

if score < 60:
    print("Grade: D.")
    pass
elif 80 > score:
    print("Grade: C.")
    pass
elif 90 > score:
    print("Grade B.")
    pass
else:
    print("Grade A.")

# 多分支多条件
'''
猜拳游戏：
剪刀[0] 石头[1] 布[2]

引入random并使用randint--随机int
'''

person = int(input("请选择[剪刀-0 石头-1 布-2]"))
computer = random.randint(0, 2)

print("Computer: %d" % computer)

if person == 0 and computer == 1:
    print("Computer win!")
elif person == 1 and computer == 2:
    print("Computer win!")
elif person == 2 and computer == 0:
    print("Computer win!")
elif person == computer:
    print("Draw.")
else:
    print("Person win!")

# if-else的嵌套使用
if person == 0 and computer == 2 or person == 1 and computer == 0 or person == 2 and computer == 1:
    if score >= 90:
        print("Class 1.")
    elif score >= 70:
        print("Class 2.")
    elif score >= 60:
        print("Class 3.")
    else:
        print("Class 4.")
else:
    print("Class 5.")

# break语句和continue语句
for turns in range(0, 100):
    num_first = random.randint(0, 10)
    num_second = random.randint(0, 5)
    turns += 1
    if num_first * num_second >= 34:
        print("Num_first: %d, Num_second: %d." % (num_first, num_second))
        print("Now is the %d turns, and product is %d." % ((turns + 1), num_first * num_second))
        break

for data_items in range(0, 100):
    data_items += random.randint(0, 10)
    if data_items == 34:
        print("Program stop at %d." % data_items)
        continue
