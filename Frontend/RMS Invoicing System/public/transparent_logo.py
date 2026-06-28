from PIL import Image

input_path = "BonLogo_dark_1.png"
img = Image.open(input_path)

img = img.convert("RGBA")
img2 = Image.new("RGBA", img.size, (0, 0, 0, 0))

datas = img.getdata()
new_data = []
for item in datas:
    if item[0] >= 255 and item[1] >= 255 and item[2] >= 255:
    	new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)
img2.putdata(new_data)
img2.save("T_BonLogo_dark_1.png")

print("Images saved successfully!")

