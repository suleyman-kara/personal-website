---
title: "Right-click, convert: why Shock Convert exists"
date: 2026-11-15
kind: article
summary: "An e-commerce panel that only accepted JPEG, a chore that repeated every day, and the small Windows tool I ended up writing."
---

For a while I ran the product side of an e-commerce business. The system we used accepted only JPEG images. Most of the images I downloaded came as PNG or WebP, so every time I had to convert them first.

For a single image that is no problem. But the job repeated every day and the steps added up: open a program, pick the file, pick the format, save. Online converters were quicker, but I did not want to upload the files to the internet.

What I had in mind was as simple as dealing with zip files: right-click the file, pick the format, done.

## The tool

Shock Convert does exactly that. It sits in the File Explorer right-click menu on Windows and converts between PNG, JPG, WebP, BMP, GIF, TIFF and ICO. The files never leave the computer.

I wrote it in Rust. The core library and the command-line tool are separate parts, it converts multiple files in parallel, and the installer does not ask for admin rights.

Once I started using it in my own work, getting the result straight away felt great. There is something special about running into a need yourself and solving it yourself.

## What's next

I have other features in mind. I have not started on them yet; for now they are just ideas.

You can download the tool at [shockconvert.suleymankara.com](https://shockconvert.suleymankara.com) and read the code on [GitHub](https://github.com/suleyman-kara/shock-convert).
