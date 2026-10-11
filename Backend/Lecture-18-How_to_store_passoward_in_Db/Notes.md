Lecture-18-How_to_store_passoward_in_Db

We should use different passwords across different platforms and websites to increase the security.
Encryption => Conversion from one form to another.
This technique is used inside the DB and the hacker is unable to use the password because there are high chances of leaking the data of the Database
A key is used to decode the password by the DB and hence it is no of use if the hacker knows the password.

But what if this key is also hacked then it will be easy for the hacker to decode the password and hence will be able to generate the original password.
So what to do now?

Now in this case I have to design an algorithm in which I will not be able to convert the converted into the original one.
Original => Encrypted but Encrypted !=> Original

Now here Hashing enters into the field. Now what is Hashing?
Explain hashing?
But we are not using Hashing now because the Hashing is also cracked by the Hackers. Like Rainbow Sheet and they have stored normal values like what is the corresponding code for a is 123 and b 234 and so on so it is possible to get cracked by guessing.

Here enters Salting: Attaching a string by itself with the passoward and will extract a hash code based on this new passoward.
Now the question is: Should I use the same salt with all the users?
or should I use different salts with all? If I do so than I have to store them all in the database. And if I use the same salt than I can use it inside the variable in the server. But what is the need of saving Salt? To recognize the user in the future.
Now if you use the same Salt than what is the problem? This salt can be stolen and hence it is easy to break the passoward.
That's why we go for the second method. But now we have to store the salt in the database.
first download bcrypt library
and the complete and step by step use of bcrypt for securing the password.
npm i bcrypt

how to read this code, step by step and easy understanding of this hashcode.
$2b$10$tXCdbqYVEDCHuFIiI/Kr0OvI08Nyu7VgkKaHfianWmweFPAVJzccq
bcrypt version + salt character + no of characters of hash code for the pass
