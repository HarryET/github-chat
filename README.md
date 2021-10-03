# Github Chat

Realtime Chat for GitHub Repositories | Part of the Supabase Hacktoberfest Hackathon

<hr/>

## Supabase Submission

### Team

- HarryET - [GitHub](https://github.com/HarryET) [Twitter](https://twitter.com/TheHarryET)
- Hugo Cárdenas - [GitHub](https://github.com/hugo-cardenas) [Twitter](https://twitter.com/_hugocardenas)
- Sterling - [GitHub](https://github.com/VictorPeralta)
- Hemanthdatta5 - [GitHub](https://github.com/Hemanthdatta5)

### Instructions

To use Github Chat go to the [app](https://harryet.me) and then login. From there you can create a new chat for any repository you have admin permissions on. Or you can find an existing chat to join!

### How we used supabase?

We have used all the features of supabase! They are broken down below with a more in-depth explanation for each.

#### Auth

- Github 0Auth

#### Storage

As people have the ability to upload files to chats we have used Storage to store those files and then serve them to everyone elses clients when the chats are read. We didn't have to store profile pictures as Github already manages that.

#### Realtime

The primary function of the app is to have a realtime chat for github repos so we have used realtime to listen for new messages and then update the messages being shown in the chat & feed.

#### Database

All of the data for the app has been store in the Supabase Postgresql database so it can be accessed through the SDKs with row level security enabled

## Development

### Run

```
yarn dev
```
