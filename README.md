# Overview
## 日本語
『ChainGPT』はブロックチェーンを活用し、AIの「ちゃちゃしば」の人格育成・チャットができるツールです。参加者みんなで「ちゃちゃしば」を育成することができます。育成はSSSの使用、または指定アドレスへメッセージ付きトランザクションを送信する事でも育成可能です。「ちゃちゃしば」を育ててくれた参加者にはお礼のモザイクをプレゼント！このツールで日々育成されていく「ちゃちゃしば」とのチャットをお楽しみください。あなたも「ちゃちゃしば」育ての親の一人になりませんか？
## English
"ChainGPT" is a tool that utilizes blockchain technology to develop and enable chatting with the AI personality "Chacha Shiba." All participants can collectively raise "Chacha Shiba." You can nurture it by using SSS or sending a message-enabled transaction to a designated address. As a token of gratitude, we will present a thank-you mosaic to those who help raise "Chacha Shiba." Enjoy chatting with "Chacha Shiba," which is nurtured day by day through this tool. Why not become one of the parents raising "Chacha Shiba" yourself?

# Dataflow
## Web version
<img width="1731" alt="webflow" src="https://user-images.githubusercontent.com/14288406/229506535-fd63c6fe-e197-4b44-9e70-61267dacce57.png">

### Input
1. Enter the settings values on the screen.
2. Send the settings values to an intermediary address using transaction messages.
3. Send the settings values to a designated address (where AI personality information sent by multiple users accumulates).

### Output
1. Send the user's message from the chat screen.
2. Retrieve the pre-set personality information for each individual.
3. Transmit the personality information and the user's message.
4. Obtain the reply message from the AI.
5. Display the AI's reply message on the screen.

## TransactionMessage version
<img width="1634" alt="Tx応答データフロー" src="https://user-images.githubusercontent.com/14288406/229541143-b1f0d4c6-dbab-48c2-8b27-d2f19d4594c4.png">

### Input
1. Enter the settings values into the transaction message.
2. Send the settings values to an intermediary address using transaction messages.
3. Send the settings values to a designated address (where AI personality information sent by multiple users accumulates).

### Output
1. Send a message with the transaction to the reply address.
2. Monitor transactions addressed to the reply address in the transaction message.
3. Retrieve the pre-set personality information for each individual.
4. Transmit the personality information and the user's message.
5. Obtain the reply message from the AI.
6. Insert the AI's reply message into the transaction message and reply to the sender's address.
