This is the graphical interface that you can use to interact with [sisl](https://github.com/zerothi/sisl).

<p align="center">
  <img src="https://github.com/pfebrer/sisl-gui/assets/42074085/5f0e1935-38fd-479a-86b4-28b7418bc046" alt="flows">
</p>

It consists of two parts:
- [Back-end](sisl_gui): The backend is implemented in python. The most important part is the `Session` class which stores
and manages the app state. The `Session` can be connected to the frontend either using pyodide (it runs directly on the browser)
or through sockets (implemented with `flask` and `flask-socketio`).
- [Front-end](frontend): A javascript/typescript UI, which is developed using [React](https://reactjs.org/). The build is
shipped with the python package and also available at https://pfebrer.github.io/sisl-gui/.

# What can I use it for?

You can quickly plot files:

<p align="center">
  <img src="https://github.com/pfebrer/sisl-gui/assets/42074085/5cf8b1df-b381-442c-ba94-953e50d235c0" alt="quickplot">
</p>

Or graphically play with complex workflows that you can share with others:

<p align="center">
  <img src="https://github.com/pfebrer/sisl-gui/assets/42074085/5f0e1935-38fd-479a-86b4-28b7418bc046" alt="flows">
</p>

# User guide

## Installation

It is extremely simple to install `sisl-gui` with `pip`:

```
pip install sisl-gui
```

## Usage

### From the browser

This is the simplest way, since it doesn't have any requirements. **You don't even need to install it** as mentioned
in the previous section, just go to https://pfebrer.github.io/sisl-gui/.

### From a terminal

You can use the `sisl-gui` command.

### From python

```python
import sisl_gui

app = sisl_gui.launch()
```

# Info for developers

## The build branch

The `build` branch contains the ready-to-use UI. You can download its contents and open `index.html` in your favorite browser to start enjoying it.

This branch is shipped automatically with the `sisl-gui` package and is available at [`https://pfebrer.github.io/sisl-gui/`](https://pfebrer.github.io/sisl-gui/) (hosted by github pages).

When a commit is pushed to the `master` branch and files inside the `frontend` folder have been modified, a build is generated and this branch is automatically updated through Github Actions.

## Source branches

The rest of branches are sources. 

If you want to **develop a new feature/fix a bug**:

- In the backend (python): Proceed as you would usually do for any other python package. The version of the frontend will be fixed and available under `frontend/build` as static files, so there are no extra requirements.
- In the frontend (javascript/typescript): You'll need to have [`nodejs`](https://nodejs.org/en/) and [`npm`](https://www.npmjs.com/) installed. These two dependencies can be installed in a conda environment like: `conda install -c conda-forge nodejs`. Then, run `npm install` inside the `frontend` directory. This should install all the project's dependencies as listed in the `package.json` file. Then just run `npm start` to start a development server where you can visualize your code changes in real time. If you want to generate a production build, you should run `npm run build`.

## Integration between front-end and python package

The same trigger that updates the [build branch](#the-build-branch) also pushes the new build to [its location in the python package](sisl_gui/build). So, any change implemented to the front-end is immediately synced to the python package if the tests pass succesfully. Therefore, don't forget to `git pull` to get the last build!
