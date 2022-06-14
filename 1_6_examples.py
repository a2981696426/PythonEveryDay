import random
"""
猜年龄：
1.用户最多尝试3次
2.每尝试3次后询问用户是否继续，若继续输入Y/y则再尝试3次，输入N/n则退出
3.若猜对则退出
"""
# version_01 —— 双循环的方式
data_item = 0
while data_item < 1:
    for i in range(0, 3):
        age = random.randint(20, 22)
        age_input = int(input("Answer:"))
        if age_input == age:
            print("Guess right.")
            data_item = 1
            break
        else:
            print("Wrong. Age: %d" % age)
    else:
        answer_input = input("Continue?(Y/N)")
        if answer_input == "Y" or answer_input == "y":
            data_item = 0
        elif answer_input == "N" or answer_input == "n":
            data_item = 1

# version_02 —— 单循环
i = 0
while i in range(0, 3):
    age = random.randint(20, 21)
    age_input = int(input("Age: "))
    if age == age_input:
        print("Guess right.")
        break
    elif age_input > age:
        print("Guess too big.")
    else:
        print("Guess too small.")
    i += 1
    if i == 3:
        answer_input = input("Continue?(Y/N)")
        if answer_input == "Y" or answer_input == "y":
            i = 0
        elif answer_input == "N" or answer_input == "n":
            i = 4
        else:
            print("Please enter the correct content.")

"""
根据BMI公式（体重除以身高的平方）计算BMI指数：
男性：
    低于20：过轻
    20-25：正常
    25-30：过重
    30-35：肥胖    
    高于35：严重肥胖
女性：
    低于19：过轻
    19-24：正常
    24-29：过重
    29-34：肥胖
    高于34：严重肥胖
用if-elif判断并打印结果
"""
sex = input("Sex(Male/Female): ")
height = float(input("Height(m): "))
weight = float(input("Weight(kg): "))
BMI = weight/height ** 2
if sex == "Male":
    if BMI < 20:    # %.2f保留两位小数的浮点数，%d保留整数位
        print("You are too skinny and need to gain weight, the BMI index is %.2f." % BMI)
    elif 20 <= BMI < 25:
        print("You are healthy and please keep, the BMI index is %.2f." % BMI)
    elif 25 <= BMI < 30:
        print("You are a little overweight and need to be careful, the BMI index is %.2f." % BMI)
    elif 30 <= BMI < 35:
        print("You have reached obesity and need to lose weight, the BMI index is %.2f." % BMI)
    else:
        print("You are too fat and please start exercising now, the BMI index is %.2f." % BMI)
elif sex == "Female":
    if BMI < 19:
        print("You are too skinny and need to gain weight, the BMI index is %.2f." % BMI)
    elif 19 <= BMI < 24:
        print("You are healthy and please keep, the BMI index is %.2f." % BMI)
    elif 24 <= BMI < 29:
        print("You are a little overweight and need to be careful, the BMI index is %.2f." % BMI)
    elif 29 <= BMI < 34:
        print("You have reached obesity and need to lose weight, the BMI index is %.2f." % BMI)
    else:
        print("You are too fat and please start exercising now, the BMI index is %.2f." % BMI)
