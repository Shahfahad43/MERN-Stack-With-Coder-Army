# Lecture 27: Large Language Models (LLMs)

Artificial Intelligence · Machine Learning · Deep Learning · Natural Language Processing · Generative AI

## 1. What Is an LLM?

LLM stands for Large Language Model.

A Large Language Model is an AI model trained on large amounts of text and other language data to learn patterns in language and generate appropriate responses to user inputs.

It can perform tasks such as:

- Answering questions.
- Explaining difficult concepts.
- Writing and debugging code.
- Translating languages.
- Summarizing books and documents.
- Following instructions.
- Reasoning through many types of problems.
- Generating content it has never encountered in exactly the same form before.

Examples of LLMs include:

- GPT.
- Claude.
- Gemini.
- Llama.
- DeepSeek.

These models differ in their architectures, training methods, sizes, capabilities, and deployment options. Not every model in every family is an LLM of the same size or capability.

### 1.1 Why Is It Called a Large Language Model?

Each word describes an important property of the system.

### Large

It generally refers to the enormous number of learned parameters and the scale of training data and computation used to build the model. It does not simply mean that the software file is large.

### Language

The model learns patterns in language, including words, grammar, meaning, relationships, and context. Modern models may also process images, audio, video, or other data.

### Model

A model is a mathematical system whose parameters are adjusted during training to learn patterns from examples and produce predictions.

### 1.2 Why Not Call It a Database or a Search Engine?

An LLM is different from both.

| System        | How it works                                                              | Example                                        |
| ------------- | ------------------------------------------------------------------------- | ---------------------------------------------- |
| Database      | Stores structured information and retrieves records.                      | Finding a student's university ID.             |
| Search engine | Searches an index of documents and ranks relevant results.                | Finding web pages about Redis.                 |
| LLM           | Uses learned parameters to predict and generate outputs based on context. | Explaining how Redis works in simple language. |

An LLM can generate a new explanation rather than retrieve a previously written explanation word for word. However, its training may have included similar explanations, and it can also reproduce memorized material.

Important: An LLM is not necessarily connected to the internet, and it does not automatically know every current fact. Web access is an additional capability that some AI applications provide.

## 2. The Fundamental Question: How Can a Machine Understand and Answer Human Questions?

Imagine you ask an AI:

> Explain the difference between JavaScript's `map()` and `filter()` methods using a real-world example.

The model must do much more than find the words `map` and `filter`.

It needs to recognize the programming context, identify the requested comparison, select relevant concepts, organize the explanation, and generate understandable sentences.

How does it do that?

The short answer is that the model has learned statistical and structural patterns from training data and uses those learned patterns to predict an appropriate sequence of tokens.

Let's build this understanding from the beginning.

### 2.1 The Early Approach: Explicitly Programming Every Rule

Imagine trying to create a machine that answers every possible English question by manually writing rules.

You might begin with:

```
IF the user asks "What is a cat?"
THEN return "A cat is a small domesticated mammal."

IF the user asks "What is a dog?"
THEN return "A dog is a domesticated mammal."

IF the user asks "What is a computer?"
THEN return "A computer is an electronic device."
```

This approach is called a rule-based approach when the system relies on explicitly defined rules.

It works for a limited set of predictable situations, but it quickly becomes difficult to maintain.

What happens if the user asks:

- "Can you explain cats to a five-year-old?"
- "How is a cat different from a dog?"
- "What if a cat has never seen a human?"
- "Explain cats in Urdu."
- "Explain the same thing using a JavaScript object."

You would need many more rules and combinations.

The problem is not that computers cannot follow rules. The problem is that natural language has too many possible combinations, ambiguities, contexts, and exceptions to handle effectively through manually written rules alone.

### 2.2 A Second Approach: Store Questions and Answers

Another idea is to create a large collection of questions and answers.

```
const answers = {
  "What is JavaScript?":
    "JavaScript is a programming language.",

  "What is React?":
    "React is a library for building user interfaces.",
};
```

This is similar to a lookup table.

But consider the following questions:

```
What is JavaScript?
Explain JavaScript.
Tell me about JS.
What does JavaScript do?
Can you teach me JavaScript?
```

All five questions may ask for similar information, but their text is different.

A basic lookup table may fail unless you explicitly account for those variations.

There is also an even bigger problem: the number of possible questions is practically unlimited.

A fixed answer database cannot naturally handle every new combination of concepts, wording, and context.

An LLM takes a different approach. Instead of relying only on exact question-answer matches, it learns patterns that can be applied to new inputs.

### 2.3 The Machine Learning Approach

Machine learning changes the way we build the system.

Instead of programming every answer, we provide examples and train a model to learn useful patterns.

For example, it may encounter many sentences such as:

- A dog is an animal.
- A cat is an animal.
- A bird is an animal.
- A dog can bark.
- A bird can fly.
- A cat can purr.

Across a sufficiently rich training dataset, the model learns statistical relationships among words and concepts.

It can then generate a response to a new question such as:

> Which animal might purr?

The answer does not have to be stored as a fixed response to that exact question.

This is one reason LLMs can generalize to new combinations of information.

However, there is an important limitation: a model can generate a plausible answer without that answer being correct. Generalization is not the same as guaranteed understanding or factual accuracy.

## 3. Tokenization: How Does an LLM Read Text?

Tokenization is one of the most important concepts for understanding LLMs.

### 3.1 What Is Tokenization?

Tokenization is the process of converting text into smaller units called tokens. These tokens are then mapped to numerical IDs that the model can process.

A token may represent:

- A complete word.
- Part of a word.
- A punctuation mark.
- A space combined with a word.
- A number or part of a number.
- A special control token.

A token is not necessarily a complete word.

For example, a tokenizer might represent the following sentence as:

### Example: Tokenization

The developer is coding.

Illustrative tokenization — actual token boundaries depend on the tokenizer.

The

developer

is

cod

ing

.

In this illustration, "coding" is divided into two tokens. A real tokenizer might instead treat it as one token.

The model does not directly process the English sentence as a human reader does. The tokenizer converts it into a representation the model can process mathematically.

### 3.2 Tokenization Is Not the Same as Splitting by Spaces

Consider this sentence:

```
I'm learning programming!
```

A simple whitespace-based splitter might produce:

```
["I'm", "learning", "programming!"]
```

But an LLM tokenizer may split the same text into a different sequence of tokens, perhaps separating punctuation or dividing words into subword pieces.

Why? Because tokenization is designed to create a vocabulary that balances several requirements:

- Represent common words efficiently.
- Handle rare words and new combinations.
- Keep the vocabulary manageable.
- Process many different languages and writing systems.
- Avoid requiring a separate vocabulary entry for every possible word.

Common tokenization approaches include:

| Method          | Basic idea                                                                |
| --------------- | ------------------------------------------------------------------------- |
| Word-level      | Treats whole words as tokens.                                             |
| Character-level | Treats individual characters as tokens.                                   |
| Subword-level   | Represents text using frequently occurring words and smaller word pieces. |
| Byte-level      | Uses byte representations to help represent arbitrary text.               |

Many modern LLM tokenizers use subword or byte-level techniques, although the exact design varies by model.

### 3.3 Why Do We Need Tokenization?

There are several reasons.

1\. Computers need numerical representations.

A neural network performs mathematical operations. A tokenizer gives the model a way to represent text as a sequence of discrete symbols and numerical IDs.

2\. The vocabulary must be manageable.

Imagine creating a separate token for every possible English word, every spelling variation, every name, and every new technical term.

The vocabulary would become enormous, and unseen words would be difficult to handle.

Subword tokenization helps solve this problem.

3\. The model must handle unfamiliar words.

Consider a new technical term:

```
Neurocomputationalization
```

A tokenizer may split it into familiar pieces rather than requiring the entire word to exist as a single vocabulary entry.

This does not mean the model automatically understands the new concept. It means it can represent the text and attempt to infer its meaning from the pieces and context.

4\. Tokenization makes text processing more consistent.

The model works with token IDs rather than needing a separate neural-network input format for every possible written word.

### 3.4 What Would Happen If We Did Not Use Tokenization?

We need to distinguish two possibilities.

- If we fed raw text directly into a conventional neural network without a representation step, the network would not have the numerical input it needs.
- If we used characters or bytes instead, we could still build a language model. Tokenization is not the only possible solution; it is a practical design choice.

Without subword tokenization, a character-level model would generally process longer sequences. A word-level model would have trouble with unseen words and would need a much larger vocabulary to cover them.

Subword tokenization offers a useful compromise between sequence length and vocabulary size.

### 3.5 How Does Tokenization Work in Practice?

Let's follow a simplified example.

User input:

```
What is React?
```

A tokenizer might produce token IDs such as:

```
[2061, 374, 12345, 30]
```

These numbers are illustrative only. Actual token IDs depend on the tokenizer and model.

The process is:

Text

What is React?

Tokenizer

Splits text into tokens.

Token IDs

[2061, 374, 12345, 30] — illustrative

Embeddings

Numerical vectors representing tokens.

Transformer model

Processes the sequence and predicts what comes next.

Tokenization is only the first stage. The model still needs to process context and learn relationships among the tokens.

## 4. How Does an LLM Learn the Meaning of Tokens?

If a tokenizer converts `React` into a numerical ID, does the number itself contain the meaning of React?

No.

A token ID is simply an identifier. The model learns useful representations through a process called embedding.

### 4.1 What Is an Embedding?

An embedding converts a token ID into a vector: a list of numerical values.

For example, imagine a simplified embedding:

```
Token: "cat"

Embedding:
[0.21, -0.43, 0.87, 0.12, ...]
```

These values are illustrative. Real embeddings can contain hundreds or thousands of dimensions, depending on the model.

During training, the model adjusts its learned parameters so that these numerical representations become useful for predicting language.

### 4.2 How Can Numbers Represent Meaning?

Consider these words:

- Cat
- Dog
- Apple
- Car

A model learns from the contexts in which these words appear. Words used in similar contexts can develop related representations.

For example:

- Cat and dog often appear near words such as `pet`, `animal`, and `food`.
- Apple and banana often appear near words such as `fruit`, `eat`, and `sweet`.
- Car and truck often appear near words such as `drive`, `road`, and `engine`.

The model's internal representations can capture some of these relationships.

However, embeddings are not fixed dictionary definitions. Their interpretation depends on the model's learned parameters and, after further processing, the surrounding context.

### 4.3 Why Is This Important?

It helps explain why LLMs are not simply lookup tables.

A lookup table requires an exact key or a deliberately designed matching strategy.

A learned model processes numerical representations through many layers of mathematical operations. Those operations can combine patterns from multiple tokens and their context.

This allows the model to produce useful answers for combinations of ideas it has not seen in precisely the same form before.

Key distinction: Token IDs identify tokens; embeddings represent them numerically; the Transformer layers refine those representations using context.

## 5. How Does the Model Understand Context? The Transformer Architecture

A token by itself is often ambiguous.

Consider the word `bank`:

- "I deposited money in the bank."
- "We sat beside the river bank."

The token `bank` appears in both sentences, but its meaning differs.

A capable language model needs to use surrounding words to determine which interpretation fits the context.

This is where the Transformer architecture and its attention mechanism become important.

### 5.1 What Is a Transformer?

A Transformer is a neural-network architecture introduced in the 2017 research paper Attention Is All You Need. It made extensive use of attention mechanisms and enabled more parallelizable training than many earlier sequence-processing approaches.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://arxiv.org&sz=32)

arXiv+1

Modern LLMs often use Transformer-based architectures, although not every language model must use a Transformer.

At a high level, a typical text-generating Transformer processes input through these stages:

Input text

Tokenization

Text → token IDs

Embeddings + positional information

Represent token identity and sequence position.

Transformer layers

Attention and other neural-network operations.

Output probabilities

Scores for possible next tokens.

Select the next token

The process repeats until the model reaches an appropriate stopping condition.

### 5.2 What Is Attention?

Attention allows the model to combine information from different parts of the input sequence when computing a token's representation.

Suppose the input is:

> Fahad put the laptop in his bag because it was heavy.

To interpret `it`, the model may use relationships between the words in the sentence. It can learn that `laptop` is a plausible referent for `it`.

This is a simplified illustration of contextual processing, not a claim that the model always resolves references correctly.

Attention helps the model assign different importance to different parts of the available context when processing a token.

### 5.3 Self-Attention: A Simple Mental Model

Imagine the sentence:

> The student opened the book because he wanted to study.

When processing `study`, information about `student`, `book`, and `opened` may be useful.

Self-attention lets the model compute relationships among tokens in the same sequence.

A simplified description of attention uses three vectors:

- Query (Q): What information is this position looking for?
- Key (K): What information does another position offer for matching?
- Value (V): What information is passed along when that position is attended to?

The model calculates compatibility scores between queries and keys, converts those scores into weights, and uses the weights to combine value vectors.

The standard scaled dot-product attention operation is:

\\[ \operatorname{Attention}(Q,K,V) = \operatorname{softmax} \left( \frac{QK^\top}{\sqrt{d_k}} \right)V \\]

Here, \\(d_k\\) is the dimension of the key vectors.

You do not need to memorize the equation immediately. The important concept is that the model computes relationships between token representations and combines information according to learned weights.

### 5.4 Why Are There Multiple Transformer Layers?

A single layer performs only part of the computation.

A Transformer typically stacks many layers so that each layer can refine the representations produced by previous layers.

At a high level, a Transformer block includes:

1. An attention mechanism.
2. A feed-forward neural network.
3. Additional operations such as normalization and residual connections.

Different layers can learn different kinds of patterns. These may include local relationships, grammatical structure, longer-range dependencies, and task-relevant abstractions.

The actual division of knowledge among layers is complex; it is not a simple one-layer-per-concept system.

### 5.5 How Can the Model Generate Something New?

Suppose a model has learned patterns about:

- React components.
- JavaScript functions.
- Shopping carts.
- State management.

You ask:

> Explain how a shopping cart could be built using React state.

The model can combine learned patterns from these topics to generate an explanation of a new combination.

It does not need a prewritten answer matching that exact sentence.

This capability is called generalization.

Generalization explains a significant part of the flexibility of LLMs, although the reliability of their output varies. A novel combination of familiar concepts is not the same as discovering a genuinely new scientific fact.

## 6. The Most Important Principle: Predicting the Next Token

Many text-generating LLMs are trained using a simple objective:

Given the previous tokens, predict the next token.

This is called next-token prediction or autoregressive language modeling.

### 6.1 A Simple Example

Suppose the input is:

```
The sun rises in the
```

The model may assign probabilities to possible next tokens:

| Candidate token | Illustrative probability |
| --------------- | ------------------------ |
| east            | 0.65                     |
| morning         | 0.15                     |
| sky             | 0.10                     |
| west            | 0.02                     |
| Other tokens    | 0.08                     |

These numbers are purely illustrative, not measured probabilities from a real model.

The model selects a token according to its decoding strategy. If it selects `east`, the sequence becomes:

```
The sun rises in the east
```

The model then predicts the next token using the expanded sequence.

It might generate:

```
The sun rises in the east and sets in the west.
```

The complete response is produced through repeated predictions.

### 6.2 How Does It Answer a Whole Question?

Imagine you ask:

> What is a variable in JavaScript?

The model does not normally retrieve one fixed paragraph and output it unchanged.

A simplified generation process looks like this:

```
Input:
"What is a variable in JavaScript?"

Prediction 1:
"A"

Prediction 2:
" variable"

Prediction 3:
" in"

Prediction 4:
" JavaScript"

Prediction 5:
" is"

Prediction 6:
"a named storage location..."
```

These are illustrative steps. Real models may generate different token sequences, and one token may represent a whole word or only part of a word.

At each step, the model uses the available context to produce a distribution over possible next tokens.

It then selects a token, adds it to the sequence, and repeats.

### 6.3 Does Next-Token Prediction Mean the Model Only Guesses Words?

It is a prediction task, but that does not mean it is equivalent to randomly guessing words.

During training, the model is repeatedly exposed to examples in which language has structure. Predicting the next token well can reward the model for learning many useful regularities, including grammar, factual associations, code structure, and some forms of reasoning.

For example, to complete:

```
function add(a, b) {
  return
}
```

a code-trained model benefits from learning patterns about functions, parameters, expressions, and syntax.

However, next-token prediction does not guarantee truth, logical consistency, or correct reasoning. A fluent continuation can still be wrong.

### 6.4 How Does the Model Decide Which Token Comes Next?

The final Transformer representation is mapped to scores called logits. A softmax operation can turn these scores into a probability distribution over the model's vocabulary.

A decoding strategy then chooses a token.

Common approaches include:

- Greedy decoding: Choose the highest-scoring token.
- Sampling: Randomly select a token according to a probability distribution.
- Temperature: Adjust the distribution to make choices more or less concentrated.
- Top-k or top-p sampling: Restrict selection to a subset of plausible tokens.

The strategy affects the output. More randomness does not automatically mean more creativity or higher quality, and lower randomness does not guarantee correctness.

### 6.5 Interactive Example: Next-Token Prediction

Try completing the sentence below. The suggestions are simplified human-language examples, not predictions from a live LLM.

Input sequence

The developer writes code in

Choose a possible continuation

JavaScript

Python

the refrigerator

Combined sequence

### The developer writes code in JavaScript

A real model compares candidates using learned probabilities and context. The most probable continuation depends on the exact input and model.

## 7. Training an LLM: How Does It Learn?

Now that we understand how a model generates text, the next question is:

Where did the learned patterns come from?

They come primarily from training.

Training is the process of adjusting a model's parameters based on data and an optimization objective.

### 7.1 What Are Model Parameters?

Parameters are learned numerical values inside the neural network.

They are often called weights.

A model may contain millions, billions, or even hundreds of billions of parameters, depending on its design.

These numbers are not simply a list of answers. Together, they determine how the model transforms its input into predictions.

For example, a model does not necessarily store an entry like:

```
Question: What is React?
Answer: React is a JavaScript library...
```

Instead, its parameters encode learned patterns that help it generate responses when given relevant context.

A model can still memorize parts of its training data, so it would be inaccurate to claim that no information is stored in a recoverable form.

### 7.2 Stage One: Pretraining

Pretraining teaches the model general language patterns and other capabilities using a large training corpus.

A typical text-pretraining process is:

1. Collect and prepare training data.
2. Tokenize the text.
3. Feed sequences of tokens to the model.
4. Ask the model to predict the next token.
5. Compare the prediction with the actual token.
6. Calculate a loss measuring prediction error.
7. Use backpropagation to calculate gradients.
8. Use an optimizer to adjust the parameters.
9. Repeat across many batches of data.

For a sequence such as:

```
JavaScript is a programming language.
```

the model can be trained to predict each next token from the preceding context.

Over many examples, it learns patterns that improve its predictions.

### 7.3 What Is the Loss Function?

A loss function measures how poorly the model's predictions match the training targets.

For next-token prediction, a common objective is cross-entropy loss.

Conceptually:

- If the correct next token receives a high predicted probability, the loss is relatively low.
- If the correct next token receives a low predicted probability, the loss is relatively high.

The training process aims to reduce the loss across the training data.

The model does not update its parameters every time a user asks a question in an ordinary inference session. Training and inference are different processes.

### 7.4 Stage Two: Instruction Tuning

A pretrained model may be good at continuing text but not necessarily at following instructions.

For example, you ask:

> Explain recursion in simple language.

A base model might continue with a fragment, an unrelated example, or text resembling a textbook passage.

Instruction tuning trains a pretrained model on examples of instructions paired with desired responses.

Example:

```
Instruction:
Explain recursion to a beginner.

Desired response:
Recursion occurs when a function calls itself...
```

The model learns patterns associated with responding to user instructions.

### 7.5 Stage Three: Alignment and Human Preferences

Instruction tuning is not the only way to improve assistant behavior.

Developers may also use human feedback, preference data, reward models, reinforcement learning, or other optimization methods.

A simplified example:

1. The model generates two answers.
2. Human evaluators indicate which answer is more useful.
3. A training process uses that feedback to improve future behavior.

One influential approach is Reinforcement Learning from Human Feedback (RLHF).

Not every modern model uses the same alignment process. Some use different preference-optimization techniques or combinations of supervised and reinforcement-learning methods.

The goal is to make the model more useful, follow instructions more reliably, and behave according to specified safety requirements.

### 7.6 The Complete Training Pipeline

Training data

Books, articles, code, and other permitted data.

Tokenization

Convert text into token IDs.

Pretraining

Learn general patterns through prediction.

Instruction tuning

Learn to respond to instructions.

Alignment and evaluation

Improve helpfulness, reliability, and safety.

Deployed model

Generates responses when prompted.

This is a simplified common pipeline, not a universal sequence followed identically by every model.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://learn.microsoft.com&sz=32)

Microsoft Learn+2

## 8. Historical Evolution: Why Couldn't Engineers Build Today's LLMs Earlier?

LLMs did not suddenly appear because someone discovered one magical algorithm. Their development depended on decades of progress in machine learning, data availability, computing hardware, neural-network architectures, and training techniques.

### 8.1 A Brief History

## 1950s–

1960s

Rule-based AI and early language processing

Researchers experimented with symbolic reasoning, manually specified rules, and early language-processing systems. These approaches could demonstrate impressive behavior in restricted settings but struggled with the variety of real-world language.

## 1980s–

2000s

Statistical language models

Researchers increasingly used probabilities learned from data. Systems improved at predicting words and processing language, but many approaches relied on limited context or task-specific engineering.

## 2010s

Neural networks and word embeddings

Deep learning improved language representations. Recurrent neural networks and related architectures could model sequences, while attention mechanisms helped systems focus on relevant parts of an input.

## 2017

The Transformer

The paper Attention Is All You Need introduced a Transformer architecture that used attention instead of recurrent processing as its core sequence mechanism. Its parallelizable design helped make large-scale training more practical.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://arxiv.org&sz=32)

arXiv+1

## 2018–

2019

GPT, BERT, and GPT-2

Pretraining on large text corpora became a powerful way to build reusable language representations. Models could then be adapted to different tasks. GPT-2 demonstrated increasingly fluent text generation at scale.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://huggingface.co&sz=32)

Hugging Face+1

## 2020

GPT-3 and in-context learning

GPT-3 demonstrated that a sufficiently large pretrained model could perform a range of tasks from instructions or a few examples in its prompt, without requiring separate fine-tuning for every task.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://huggingface.co&sz=32)

Hugging Face+1

## 2022–

2023

Instruction-following assistants

Instruction tuning and preference-based training improved how models responded to human requests. Conversational products made these capabilities accessible through chat interfaces.

## 2024–

2026

Multimodal, reasoning, and tool-using systems

Modern AI systems increasingly combine language with images, audio, external tools, retrieval, and specialized reasoning methods. The exact capabilities differ by model and product.

This is a selective timeline rather than a complete history of AI. Several developments occurred in parallel, and many important research contributions are not listed.

### 8.2 The Main Problems Engineers Faced

Why couldn't early engineers simply build an LLM with today's capabilities?

| Earlier challenge                 | Why it mattered                                                                | What helped                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Limited computing power           | Large neural networks require enormous numbers of mathematical operations.     | GPUs, specialized accelerators, and distributed computing.                                       |
| Limited training data             | Small or narrow datasets restrict the patterns a model can learn.              | Larger digital text and code corpora, plus better data preparation.                              |
| Inefficient architectures         | Some earlier sequence models were harder to parallelize across long sequences. | Transformer attention and hardware-efficient training methods.                                   |
| Weak generalization               | A system might work well on training examples but fail on unfamiliar inputs.   | Larger and more diverse training, better architectures, and improved training objectives.        |
| Poor instruction following        | Predicting text alone does not guarantee useful answers to questions.          | Instruction tuning and preference-based alignment.                                               |
| Limited context                   | Older systems often struggled to use information spread across long inputs.    | Improved attention mechanisms, longer context windows, and other architectural techniques.       |
| Hallucinations and factual errors | Fluent text generation does not guarantee truth.                               | Better training, evaluation, retrieval, tools, and verification—though errors remain possible.   |
| High cost of deployment           | Training and running large models require substantial resources.               | Hardware improvements, quantization, efficient inference, smaller models, and optimized serving. |

### 8.3 Was the Transformer the Only Breakthrough?

No.

The Transformer was a major breakthrough, but modern LLMs depend on several advances working together:

- Neural-network research.
- Better optimization methods.
- Large-scale data processing.
- Parallel training.
- GPU and accelerator development.
- Better tokenization.
- Improved training datasets.
- Instruction tuning and alignment.
- Efficient inference systems.

A Transformer trained on poor data with inadequate compute would not automatically become a powerful assistant.

Similarly, having enormous computing resources without a suitable architecture and training method would not be sufficient.

The lesson: Today's LLMs are the result of accumulated improvements rather than a single invention.

## 9. How Does an LLM Remember the Conversation?

Suppose you send these messages:

You: My name is Fahad, and I am learning React.

AI: What are you building?

You: A shopping cart.

AI: You can manage the cart's state using React.

You: Which approach did you recommend?

The model needs access to the earlier messages to answer the final question appropriately.

But does the model permanently learn your name after you tell it?

Not necessarily. We need to distinguish several different concepts.

### 9.1 Context Window: Information Available During a Request

A context window is the amount of input and generated content a model can process within a particular context.

The exact limit varies by model.

A conversational application may include some or all of the following in the model's input:

- System instructions.
- Developer instructions.
- Earlier user messages.
- Earlier assistant responses.
- Relevant tool results.
- The latest user message.

Conceptually:

### A conversation becomes model input

System instructions

Earlier messages

Relevant context or tool results

Current user message

Model processes the supplied context

Generated response

This diagram is conceptual. Actual products may format the input differently and may omit, summarize, or retrieve earlier content.

The model can use information from previous messages when those messages, or relevant representations of them, are supplied in its current context.

### 9.2 Does the Model Store Every Previous Message Inside Its Weights?

No. Ordinary inference does not update the model's learned parameters each time you send a message.

A typical chat system handles conversation history by sending relevant earlier messages again as part of the input to later requests.

This is why the model can answer a follow-up question without being retrained after every message.

Consider:

```
Request 1:
User: My project is a React shopping cart.
AI: You can use useState or Redux Toolkit.

Request 2:
User: Which approach is simpler for a beginner?
```

If the relevant earlier exchange is included in the second request, the model can understand what "which approach" refers to.

If the earlier exchange is not included and no other memory mechanism supplies it, the model may not know what you mean.

### 9.3 Three Different Types of Memory

| Type                          | What it means                                                             | Example                                                                |
| ----------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Context memory                | Information supplied in the current model input.                          | Earlier messages included in the prompt.                               |
| Persistent application memory | Information a product stores and retrieves across separate conversations. | A saved preference that the user prefers detailed coding explanations. |
| Model parameters              | Patterns learned during model training.                                   | General knowledge about JavaScript and React.                          |

These are different mechanisms and should not be confused.

Persistent application memory is a product-level capability. It is not automatically part of every LLM.

### 9.4 What Happens When the Conversation Becomes Too Long?

Every model has a finite context capacity.

When a conversation becomes too long, an application may:

- Include only the most recent messages.
- Summarize older messages.
- Retrieve relevant parts of the earlier conversation.
- Store selected information in a separate memory system.
- Use a combination of these techniques.

This is why some applications can preserve useful details across long conversations even when the entire conversation is not sent to the model each time.

### 9.5 What Is the KV Cache?

The key-value (KV) cache is a technical optimization used by many Transformer-based generation systems.

During generation, the model repeatedly processes a growing sequence. Recomputing all attention keys and values for earlier tokens would be wasteful.

The KV cache stores certain intermediate attention results so they can be reused while generating subsequent tokens.

It helps speed up inference, but it is not the same as persistent personal memory.

Important distinction:

- Conversation history provides information to the model.
- Persistent memory can store selected information across sessions.
- The KV cache accelerates computations during generation.
- Model parameters contain the learned values from training.

## 10. How Does an LLM Search the Web and Give Current Information?

This is a particularly important question because an LLM does not inherently need internet access to generate an answer.

There are two different situations.

### 10.1 Situation A: The Model Answers From Its Learned Parameters

Suppose you ask:

> What is JavaScript?

The model may answer using patterns learned during training.

It does not need to search a website every time it explains a familiar concept.

However, the answer may be incomplete or outdated, depending on the model's training and other available context.

### 10.2 Situation B: The AI Application Uses a Web Search Tool

Suppose you ask:

> What are the latest changes in Node.js?

A model whose training data does not cover the latest release cannot reliably know those changes from training alone.

An AI application with web-search capabilities can use a workflow such as this:

1\. User asks a question

"What are the latest Node.js changes?"

2\. The application decides to search

The model or orchestration logic selects an appropriate tool.

3\. Search engine retrieves results

Relevant pages, snippets, and source information.

4\. Relevant information enters the context

The model receives the retrieved evidence.

5\. The model generates an answer

It summarizes the evidence in natural language.

The model's response is generated from its learned parameters together with the information supplied by the search tool.

The tool can also return URLs so the application can cite the sources it used.

### 10.3 Does the LLM Directly Browse the Internet?

Not necessarily.

The model itself generally produces tokens. An application can give it tools that perform external actions, such as:

- Searching the web.
- Opening a webpage.
- Querying a database.
- Executing code.
- Calling an API.
- Retrieving documents.

The model or surrounding orchestration logic can select a tool, receive its result, and use that result to generate the final response.

Some applications use predefined workflows rather than letting the model freely select every action.

### 10.4 What Is the Difference Between Web Search and RAG?

Retrieval-Augmented Generation (RAG) combines a language model with a separate retrieval system.

For example, imagine building a university chatbot that answers questions from a 253-page university handbook.

Rather than relying entirely on what the model learned during training, the application can:

1. Extract text from the handbook.
2. Divide it into smaller chunks.
3. Convert the chunks into searchable representations, often embeddings.
4. Store those representations in a retrieval system or vector database.
5. Retrieve relevant chunks when a question arrives.
6. Supply the retrieved text to the LLM.
7. Generate an answer grounded in the supplied material.

University PDF

Extract, chunk, and index

Knowledge base

Document chunks and searchable representations.

User asks a question

Retrieve relevant chunks

LLM generates an answer using retrieved context

RAG is useful because the application can update its knowledge base without retraining the entire language model. It can also provide specific evidence from the retrieved documents.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://csrc.nist.gov&sz=32)

CSRC+1

### 10.5 Web Search vs. RAG

| Feature               | Web search                                       | RAG over a knowledge base                                    |
| --------------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| Information source    | Web pages and search results.                    | A selected document collection or data source.               |
| Main purpose          | Find relevant online information.                | Retrieve relevant information from a defined knowledge base. |
| Updating information  | Depends on available web indexing and retrieval. | Update or re-index the knowledge base.                       |
| Source control        | Depends on the search tool and selected sources. | The application can restrict retrieval to approved sources.  |
| Guarantee of accuracy | No guarantee.                                    | No guarantee; retrieval and generation can both fail.        |

Web search can itself be implemented as a form of retrieval, and a RAG system can use web content as its knowledge source. The distinction is primarily about the workflow and the information source.

### 10.6 Why Not Simply Put All Information Inside the LLM?

Because there are practical limitations:

- Training is expensive.
- The world changes continuously.
- Private or organization-specific data may not belong in general model training.
- A model's parameters are not a convenient, directly editable database.
- A model can misremember or misstate facts.
- Updating the model's weights is not always necessary when only the underlying documents have changed.

Retrieval lets the application supply relevant external information when needed.

## 11. How Can an LLM Solve Problems It Has Never Encountered Before?

This is the central question behind the flexibility of modern LLMs.

The answer involves several related capabilities.

### 11.1 Generalization

A model learns patterns from examples and can apply those patterns to unfamiliar inputs.

Imagine it has learned:

- How JavaScript functions work.
- How arrays work.
- How loops work.
- How shopping carts store products.

You ask:

> Write a function that counts how many products cost more than 100 SAR.

The model may combine its knowledge of functions, arrays, conditions, and numerical comparisons to produce code.

The exact question may not have appeared in training, but the building blocks are familiar.

### 11.2 Compositionality

Compositionality refers to the ability to combine smaller pieces into more complex structures.

For example:

```
const expensiveProducts = products.filter(
  (product) => product.price > 100
);
```

This code combines:

- An array called `products`.
- The `filter()` method.
- A callback function.
- A comparison using `>`.
- A product property called `price`.

The model can generate the combination even if that exact line of code was never in its training data.

This is one explanation for its flexibility, though actual generalization depends on the model, the task, and the examples it learned from.

### 11.3 In-Context Learning

An LLM can sometimes learn how to perform a task from examples supplied directly in the prompt.

For example:

```
Example 1:
Input: 2
Output: 4

Example 2:
Input: 3
Output: 6

Example 3:
Input: 5
Output: ?
```

The model may infer the pattern and answer `10`.

It has not necessarily changed its parameters. It is using the examples as context during inference.

This is called in-context learning.

It is one reason modern LLMs can adapt to different tasks without being separately retrained for every task.

### 11.4 Zero-Shot and Few-Shot Learning

| Term        | Meaning                                                              | Example                                                        |
| ----------- | -------------------------------------------------------------------- | -------------------------------------------------------------- |
| Zero-shot   | Perform a task without providing worked examples in the prompt.      | "Translate this sentence into Arabic."                         |
| One-shot    | Provide one example.                                                 | Show one English-to-Arabic translation, then ask for another.  |
| Few-shot    | Provide several examples.                                            | Show five examples of a particular output format.              |
| Fine-tuning | Further train a model on a dataset to change its learned parameters. | Train a model to follow a specialized customer-support format. |

These approaches are related but not identical.

Zero-shot does not mean the model has never encountered anything related to the task. It means no explicit demonstration of that task was supplied in the current prompt.

### 11.5 Does the Model Truly Invent New Knowledge?

We need to distinguish different meanings of "new."

- New wording: The model can produce sentences not found verbatim in its training data.
- New combination: It can combine familiar concepts in an unfamiliar way.
- New solution: It may solve a problem through a combination of learned methods.
- New verified discovery: A claim about the world that has not previously been established and is independently shown to be correct.

The first three are possible, depending on the task. The fourth requires evidence and validation beyond the fact that the model generated an answer.

A model can generate a novel-looking explanation that is incorrect, or code that looks valid but fails when executed.

Practical lesson: Treat the LLM as a powerful pattern-learning and generation system, not as an infallible source of truth.

## 12. A Complete Example: What Happens When You Ask an LLM a Question?

Let's trace one request from the user's message to the final answer.

Suppose you ask:

> Explain JavaScript closures using a simple example for a beginner.

### Step 1: The application prepares the input

The application may combine system instructions, relevant conversation history, and your current question.

For example:

```
System instructions:
Explain concepts accurately and clearly.

Previous context:
The user is learning JavaScript.

Current question:
Explain JavaScript closures using a simple example.
```

The exact input format depends on the application.

### Step 2: Tokenization

The input is converted into a sequence of token IDs.

```
Text
  ↓
Tokenizer
  ↓
Token IDs
```

The IDs represent the text using the model's vocabulary.

### Step 3: Embeddings

The token IDs are converted into vectors. Positional information is also provided through the model's particular positional-encoding method.

This gives the Transformer numerical representations of the input sequence.

### Step 4: Transformer processing

The model applies attention and other neural-network operations to process the tokens in context.

It can use the relationship between terms such as `JavaScript`, `closures`, `example`, and `beginner` to produce a response suited to the request.

### Step 5: Predicting the first output token

The model calculates scores for possible next tokens and converts them into a probability distribution.

The decoding process selects a token.

### Step 6: Generating the response

The model repeatedly predicts and appends tokens until it reaches a stopping condition.

The output may contain an explanation, a code example, and a walkthrough.

### Step 7: Additional processing by the application

Depending on the product, the application may apply safety checks, format the response, execute tools, or attach source citations.

The final answer is then displayed to the user.

### The entire process in one line

User message → Context preparation → Tokenization → Embeddings → Transformer → Next-token prediction → Repeated generation → Final response

This pipeline describes a typical text-generating Transformer at a high level. Some modern systems add multimodal encoders, reasoning components, tool calls, or other stages.

## 13. Practical Project: Build a Mini Next-Token Predictor

As a backend developer, you can understand the central idea of language modeling by building a tiny predictor in JavaScript.

This is not a real LLM. It is a simple demonstration of next-token prediction using a small, manually defined dataset.

### 13.1 Example code

```
const trainingExamples = [
  {
    input: "JavaScript is a",
    nextToken: "programming",
  },
  {
    input: "JavaScript is a programming",
    nextToken: "language",
  },
  {
    input: "React is a",
    nextToken: "JavaScript",
  },
  {
    input: "React is a JavaScript",
    nextToken: "library",
  },
];

function predictNextToken(input) {
  const matches = trainingExamples.filter(
    (example) => example.input === input
  );

  if (matches.length === 0) {
    return "I do not have a matching example.";
  }

  return matches[0].nextToken;
}

console.log(predictNextToken("JavaScript is a"));
// programming

console.log(predictNextToken("React is a"));
// JavaScript
```

### 13.2 What does this demonstrate?

The program matches an input against stored examples and returns the associated next token.

But it has several limitations:

- It requires an exact input match.
- It cannot learn from the examples.
- It cannot assign learned probabilities.
- It cannot generalize meaningfully to arbitrary sentences.
- It has no trainable neural-network parameters.

Our implementation is essentially a lookup table.

A real LLM instead uses learned numerical parameters to compute predictions for many possible input sequences.

### 13.3 How would a real LLM improve on this?

A real language model would need:

1. A tokenizer and vocabulary.
2. A neural-network architecture.
3. Trainable parameters.
4. A large training corpus.
5. A loss function.
6. Backpropagation and an optimization algorithm.
7. Significant computing resources.
8. An inference system for generating tokens.

This is why building a tiny language-model demonstration is practical, while training a competitive general-purpose LLM is a much larger engineering and research task.

## 14. Important Limitations of LLMs

Understanding how LLMs work also means understanding what they cannot reliably do.

### 14.1 Hallucinations

A hallucination occurs when a model generates information that is false, unsupported, or fabricated while presenting it as if it were correct.

For example, a model might invent a software-library function that does not exist.

Why can this happen?

The model is optimized to generate outputs according to its training and inference objectives, not to guarantee that every statement corresponds to verified reality.

Practical response: Verify important claims against reliable sources, run generated code, and use retrieval or tools when appropriate.

### 14.2 Knowledge Cutoffs and Outdated Information

A model's training data has a particular scope. If an event occurs afterward, the model cannot reliably know it from that training data alone.

Web search, APIs, and retrieval systems can provide newer information, but their results also need verification.

### 14.3 Limited Context

The model cannot process an unlimited amount of information in a single context.

Even when a context window is large, relevant information can be missed, misunderstood, or underused.

### 14.4 Bias and Data Quality

Models learn from training data that can contain errors, biases, stereotypes, and uneven representation of languages or topics.

Training and alignment can reduce certain problems but cannot guarantee their complete removal.

### 14.5 Plausible but Incorrect Reasoning

A model may produce a convincing chain of explanation while making a logical or mathematical mistake.

For coding tasks, test cases, execution, and code review remain important.

### 14.6 Security Risks

LLM-powered applications can face risks such as prompt injection, unsafe tool use, leakage of sensitive information, and insecure generated code.

The model should not be treated as a replacement for access controls, input validation, authorization, or ordinary application security.

## 15. Common Misconceptions About LLMs

| Misconception                                                                | Correct understanding                                                                                               |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| An LLM is just a database of answers.                                        | It generates outputs using learned parameters, though it can memorize some training material.                       |
| Every token is a complete word.                                              | Tokens may be whole words, subwords, punctuation, or other units.                                                   |
| Token IDs contain the meaning of words.                                      | Token IDs identify vocabulary entries; learned embeddings and contextual processing provide useful representations. |
| An LLM searches the internet for every answer.                               | It can answer without web access. Search is an additional tool capability.                                          |
| The model permanently remembers every chat.                                  | Conversation context and persistent memory are separate from model parameters.                                      |
| A model can answer anything correctly because it has billions of parameters. | Size does not guarantee factual accuracy or reliable reasoning.                                                     |
| Next-token prediction means the model only copies sentences.                 | It can generalize and generate new combinations, although memorization and errors are also possible.                |
| Training and answering a question are the same process.                      | Training updates parameters; inference uses the trained model to generate output.                                   |
| More tokens always mean a better answer.                                     | Longer prompts and responses consume more resources and can introduce irrelevant information.                       |
| RAG eliminates hallucinations.                                               | Retrieval can improve grounding but does not guarantee correctness.                                                 |

## 16. Interview Questions and Answers

### Beginner level

Q1. What is an LLM?

An LLM is a large neural-network language model trained on extensive data to learn language patterns and generate or process text.

Q2. What does LLM stand for?

Large Language Model.

Q3. What is tokenization?

Tokenization converts text into smaller units called tokens, which are mapped to numerical IDs.

Q4. What is an embedding?

An embedding is a learned numerical vector representation associated with a token or other input element.

Q5. What is next-token prediction?

It is the task of predicting the next token based on the tokens that came before it.

Q6. What is the difference between an LLM and a search engine?

A search engine retrieves and ranks documents, while an LLM generates responses using learned parameters. An AI application can combine both.

### Intermediate level

Q7. Why are LLMs flexible compared with rule-based systems?

They learn reusable patterns from many examples and can generalize to new combinations of language and concepts.

Q8. Why is the Transformer architecture important?

Its attention-based design supports contextual processing and enables efficient parallelization during training.

Q9. What is self-attention?

Self-attention allows token representations to incorporate information from other tokens in the same sequence according to computed attention weights.

Q10. What is the difference between training and inference?

Training adjusts the model's parameters. Inference uses the trained parameters to generate predictions.

Q11. What is in-context learning?

It is the model's ability to use instructions or examples in its input to perform a task without necessarily updating its parameters.

Q12. Why do LLMs hallucinate?

Their generation process does not guarantee factual correctness. They can produce plausible outputs that are unsupported or false.

### Advanced level

Q13. What is the role of the loss function in LLM training?

It quantifies prediction error, providing a learning signal used to calculate gradients and adjust parameters.

Q14. Why is backpropagation used?

It calculates gradients of the loss with respect to model parameters so an optimizer can update those parameters.

Q15. What is instruction tuning?

It is additional training on instruction-response examples to improve the model's ability to follow user instructions.

Q16. What is RLHF?

Reinforcement Learning from Human Feedback is an approach that uses human preferences to help optimize a model's behavior.

Q17. What is RAG?

Retrieval-Augmented Generation retrieves relevant external information and supplies it to a generative model as context for answering a question.

Q18. What is the difference between persistent memory and the KV cache?

Persistent memory stores selected information for later use, while the KV cache stores intermediate attention results to speed up generation.

Q19. Why is a tokenizer important for computational efficiency?

Tokenization affects vocabulary size and sequence length. Both influence the computation and memory required by a language model.

Q20. Can an LLM reason?

LLMs can perform tasks that exhibit reasoning-like behavior, including multi-step problem solving. Their reliability varies, and their internal mechanisms should not be assumed to match human reasoning.

## 17. Final Revision Notes

## The LLM mental model

1. LLM: A large neural-network model trained to learn patterns in language and other supported data.
2. Tokenization: Converts input text into tokens and numerical IDs.
3. Embeddings: Convert token IDs into numerical representations.
4. Transformer: Processes token representations using attention and other neural-network operations.
5. Training: Adjusts parameters to improve the model's predictions.
6. Next-token prediction: Provides the basic generation objective for many text-generating LLMs.
7. Generalization: Lets the model apply learned patterns to unfamiliar combinations of concepts.
8. Context window: Holds the information available during a particular request.
9. Persistent memory: An optional application-level mechanism for retaining selected information.
10. Web search and RAG: Provide external information that can help the model answer questions beyond what it can reliably supply from its learned parameters.

The most important concept is that an LLM is not simply retrieving a fixed answer for every question. It converts input into numerical representations, processes relationships between tokens, and generates output through repeated prediction. Its ability to handle unfamiliar questions comes from learned patterns, generalization, and the context supplied at inference time.

## 18. Recommended Learning Resources

These resources provide reliable next steps for understanding LLMs beyond the introductory level.

[@Jaward on Hugging Face: "Awesome intro to LLM course "Language Modeling from Scratch" by stanford. love…"](https://images.openai.com/static-rsc-4/ZtV8r-16enKMOpJWRbDPvXYLikMrZzjSn93bRyZjEm67UVS5HrV80--vJEgUVvQ2zYaw_0huTaDJn5Q7mKM5W2p6M7TCiJtdkeNfsJ8sl-_SK48LyEJ2nJ4qclHPS_X4h1Rx5NtHvvYOGUI-eGri7lRFYDhiBf7zYLoNs3pi5jw?purpose=inline)

Hugging Face NLP Course

Learn tokenization, Transformer architecture, pretrained models, and practical implementation.

Free course · Beginner to intermediate

[Open the course](https://huggingface.co/learn?utm_source=chatgpt.com)

[The paper that started it all: 'Attention is all you need'](https://images.openai.com/static-rsc-4/sHTMdtuoapyF5dDrTQ7hyyFLaoKUE9uJj3_9EMqM4i5MY84gelGQr2UuZBN568ezZiwZy2ZqQIl2oovZ0h-kMhTuqpPEen15cc5P0qpcQ6IMo-OU359Zxj85WbA8s50XQpXG7vfT7-6X8_tM9g_bth5fDCYHI-yvYvu-szIH3dQ?purpose=inline)

Attention Is All You Need

The foundational paper introducing the Transformer architecture.

Research paper · Intermediate to advanced

[Read the paper](https://arxiv.org/abs/1706.03762?utm_source=chatgpt.com)

[AI, Machine Learning, Deep Learning, Generative AI: Understanding the Core Definitions | Numberly](https://images.openai.com/static-rsc-4/aoO_x4k0Fp8pcdxUStoLT-r9844Cf-QiJVttI4wQd5rdA4lO-3n17IBygBu3w269oq2qWGJbsOflkzU0saXnWpmHEn-jfq6jIQmVwinadAU8cLV-HdTH1GeAqS2P-MHlE8y4-LkEEZ3hbhlq9D_J0VnkhzkKfusv9ywU2sjcpFg?purpose=inline)

LLM Fundamentals

A developer-oriented overview of tokenization, training, inference, and model behavior.

Online documentation · Beginner

[Read the guide](https://learn.microsoft.com/en-us/agent-framework/journey/llm-fundamentals?utm_source=chatgpt.com)
