# By the Stream Website
This is the repository for Xishuipang.com website. Xishuipang(By the Stream) is a christian magazine edited, published and maintained by Toronto Chinese Gospel Church.

# Basic setup
This website uses node.js and express.js as its server and uses Mongodb for its database. If you would like to contribute, please make sure that nodejs and expressjs is installed on your local machine.

Developed by Chen Li, Xiangyu Luo.

&copy;2018 Chinese Gospel Church. All right reserved.

# Test locally
To test locally, use the following command in the command line:
```
$ node bin/www
```

# Upload Process
# Overview
This document explains the process of uploading a new volume from start to finish. You will find all the details you need in order to upload a new volume. Please note, this process can be done within a Mac environment, Windows environment hasn't been tested so please keep that in mind.

## Step 1. Download all the .docx files and images to your local drive.
### .docx Files
Move all the .docx files into the folder: `[PROJECT_LOCATION]/public/docs/[VOLUME_NUMBER]`, make sure that they are named properly.

The proper naming convention is `[ARTICLE_INDEX]_[NAME]_[CHARACTER_VERSION].docx`.

For example, in your folder it should have something like this:
```
1_prayer_s.docx
1_prayer_t.docx
2_lixiuquan_s.docx
2_lixiuquan_t.docx
...
```

### Image Files
Move all the images into this folder: `[PROJECT_LOCATION]/public/content/volume_[VOLUME_NUMBER]/images/`

## Step 2. Convert .docx files to .txt files to prepare for pre-processing.
Make sure that your environment has Python installed, and then run the following commands in a terminal:
```
$ cd [PROJECT_LOCATION]/public/scripts/
$ python doc_to_txt.py [VOLUME_NUMBER]
```

Once you run these commands, you can go to `[PROJECT_LOCATION]/public/text/volume_[VOLUME_NUMBER]` to verify that you have all the .txt versions of the previous files in this folder.
```
1_prayer_s.txt
1_prayer_t.txt
2_lixiuquan_s.txt
2_lixiuquan_t.txt
...
```

## Step 3. Pre-processing text files.
Go to `[PROJECT_LOCATION]/public/text/volume_[VOLUME_NUMBER]`, now we need to clean up all the text files created from .docx files.
For each text file, make sure that they follow this format:

```
{category}
{title}
{author}
{content}
```

For example:
```
牧师分享
灵命塑造的基本操练
文牧师

内容如下。。。。。。
```

This step prepares the text files to be parsed by a parser. Please make sure that they follow this format exactly. Otherwise you will have a good time fixing them in the JSON files later, and that's much harder to do so.

## Step 4. Insert image tags in text file.
Add image tags in all the text files. Assuming that you copied all the necessary images into `[PROJECT\_LOCATION]/public/content/volume\_[VOLUME\_NUMBER]/images/`, add the image tag to where you want the image to be located within the article.
```
normal text
normal text
<[IMAGE-FILE-NAME]>
normal text
normal text
```

For example:
You want to add an image named "cross.jpg" to show in an article named "1_prayer_s.txt", simply open "1_prayer_s.txt" in your favourite text editor, navigate to where you want the image to be added, and add the image tag there:

1_prayer_s.txt:
```
刊首语
心灵祷告
编辑同工组
<cross.jpg>
我们在天上的阿爸父，来到你面前我们感谢赞美你！虽然今年一开始我们就遇到前所未有的灾难和痛苦，但我们相信一切都在你的掌管当中。
人们期待着2020年的到来，世界会好转，人们会有更多的享受。新年伊始一个个震惊人心的消息，让人们陷在恐慌和担忧当中。美国袭击了伊朗高官，人们在担心世界局势，会不会有战争或恐怖事件；惊魂未定又爆发了新冠病毒，几十天的时间，一次没有硝烟的战争震动了全球。先是中国接着是全世界范围，都被这人眼不能见，科学家也不认识的小小病毒搞得不知所措。慌乱的人们又发出了与瘟疫一样泛滥的各样信息，人们生活在恐惧和混乱当中。
天父，当人恶贯满盈的时候，你震怒的刑罚会彰显你的公义。这些灾难和痛苦是要人从沉迷的罪中之乐中看到，当人悖逆你正道的时候，离弃你的例律典章的时候，是要承担错误选择的后果的。你盼望人能认罪悔改，重新回到你的公义和圣洁，享受你给我们的平静安祥的日子。
主耶稣说：“在世上你们有苦难，但你们可以放心，我已经胜了世界。”“我留下平安给你们，我将我的平安赐给你们。我所赐的，不像世人所赐的；你们心里不要忧愁，也不要胆怯。”
天父，我们在你面前祈求。为你的儿女们，向你祈求，让我们不管面对怎样的环境，都坚定的站在主耶稣的磐石上，让圣灵带领我们按圣经的教导过每一天的日子，掌管我们的所思所想所言所行。
求你让我们软弱的被你刚强，不忘主耶稣给我们的大使命，要把耶稣基督拯救世人的信息传递出去，让人们听到罪得赦免，重生得救的好消息。
为还没得救的人们，向你祈求，求你的怜悯临到他们。打开他们心灵的眼睛和耳朵，苏醒他们的灵魂，让他们有一颗谦卑受教的心。愿意聆听你的话语，并愿意接受主耶稣做他们的救主和生命的主，重生得救，成为你的儿女。
我们这样的祈求祷告是奉主耶稣得胜的名求！阿们！
```

"cross.jpg" must be inside `[PROJECT_LOCATION]/public/content/volume_[VOLUME_NUMBER]/images/` directory.

## Step 5. Add a metadata.txt file.
Create a new `metadata.txt` file in `[PROJECT_LOCATION]/public/text/volume_[VOLUME_NUMBER]` directory.

Add the following lines to `metadata.txt` file:
```
theme_simplified: 大使命的对象——主的门徒
theme_traditional: 大使命的對象--主的門徒
theme_english: Recipients of the Great Commission—Disciples of Christ
year: 2020
month: 4
```

Replace each field with the actual data for that volume. 

This file is very important in the parsing process!!! They will be inserted in the final JSON files.

## Step 6. Convert processed .txt files to JSON files.
Open your terminal again, change the directory to `[PROJECT_LOCATION]/public/scripts/`, and then run the `parse_txt_to_json.py` script.
```
$ cd [PROJECT_LOCATION]/public/scripts/
$ python parse_txt_to_json.py [VOLUME_NUMBER]
```

Verify that you have successfully converted all the text files to JSON files by going to `[PROJECT_LOCATION]/public/content/volume_[VOLUME_NUMBER]` directory, you should be able to see a list of JSON files, with the same name as the text files, plus two table of content JSON files, one in simplified Chinese and the other in traditional Chinese.
```
1_prayer_s.json
1_prayer_t.json
...
table_of_content_s.json
table_of_content_t.json
```

## Step 7. Push all the JSON files to MongoDB.
Open your terminal again, run the `push_json_to_database.js` script in `[PROJECT_LOCATION]/public/scripts/`
```
$ cd [PROJECT_LOCATION]/public/scripts/
$ node push_json_to_database.js [VOLUME_NUMBER]
```

This script pushes all the JSON files we just created to MongoDB so that they will be available online for other people to see.

## Step 8. Update the text on the home page, update latest volume number.
Go to `[PROJECT_LOCATION]/views/index.ejs` and in line 56, change "阅读最新第...期" to contain the latest volume number. Save the file.

Go to `[PROJECT_LOCATION]/public/js/config.js, in line 23, change the value for `LATEST_VOLUME_NUMBER` to the latest volume number and save the file.

## Step 9. Commit all the changes and push to Github.

## Step 10. Create a pull request from `develop-node` to `master`.