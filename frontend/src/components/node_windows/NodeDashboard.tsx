import { useState, useEffect, useContext} from 'react'

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import NodeOutput from './NodeOutput';
import NodeMultiWindow from './NodeMultiWindow';

import PythonApiContext from '../../apis/context';

import type { Node } from '../../interfaces';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { NodeClassesRegistryContext } from '../../context/session_context';

interface NodeDashboardProps {
    node: Node,
    node_id: number,
    name: string,
    actions?: string[]
    defaultWindows?: string[],
    windows?: string[],
    onWindowsChange?: (windows: string[]) => void,
}

const NodeDashboard = (props: NodeDashboardProps) => {
    const node = props.node
    const name = props.name

    const actions = props.actions

    const {pythonApi} = useContext(PythonApiContext)

    const [updatedName, setUpdatedName] = useState("")
    const [inputsToUpdate, setInputsToUpdate] = useState({})
    const [inputsModeToUpdate, setInputsMode] = useState<{ [key: string]: string }>({})
    const [stateWindows, setStateWindows] = useState(props.defaultWindows || ['Inputs', 'Output'])

    const windows = props.windows || stateWindows
    const setWindows = props.windows ? props.onWindowsChange || setStateWindows : setStateWindows

    // When the node changes, reset the state of the inputs. In the future we could
    // make the higher component keep the states of all the nodes and pass them here.
    // Or do it through redux maybe?
    useEffect(() => {
        setInputsToUpdate({});
        setInputsMode({});
        setUpdatedName("")
    }, [props.node_id])

    const { node_classes } = useContext(NodeClassesRegistryContext)

    if (!node) return <NodeOutput node={undefined}/>

    // Set success color on settings that have been changed but not applied yet
    var fieldprops:{[key: string]: any} = {}

    Object.keys(inputsToUpdate).forEach((key) => {
        fieldprops[key] = { success: true }
    })

    const modes_props = {
        "Inputs": {
            inputs: inputsToUpdate,
            onChange: (changed_inputs: { [key: string]: any }) => setInputsToUpdate({ ...inputsToUpdate, ...changed_inputs }),
            inputsMode: inputsModeToUpdate,
            onChangeInputsMode: setInputsMode,
            fieldprops: fieldprops,
        },
    }

    const actionButtons: {[key: string]: ReactJSXElement} = {
        remove: <Button color="error" onClick={() => pythonApi.removeNode(node.id)}>REMOVE</Button>,
        compute: <Button onClick={() => pythonApi.computeNode(node.id)}>COMPUTE</Button>,
        duplicate: <Button onClick={() => pythonApi.duplicateNode(node.id)}>DUPLICATE</Button>,
        update_inputs: <Button onClick={() => { pythonApi.updateNodeInputs(node.id, inputsToUpdate, inputsModeToUpdate); setInputsToUpdate({}) }}>UPDATE_INPUTS</Button>,
        to_workflow: <Button onClick={() => pythonApi.nodeToWorkflow(node.id)}>TO_WORKFLOW</Button>,
        reset_inputs: <Button onClick={() => { setInputsToUpdate({}); setInputsMode({}) }}>RESET_INPUTS</Button>,
        new_window: <Button onClick={() => setWindows([...windows, "Inputs"])}>NEW_WINDOW</Button>,
        "...": <Button>...</Button>,
    }

    return <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", 
            backgroundColor: "rgb(238, 242, 246)", borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 15,
            }} >
        
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div style={{borderRadius: 5, backgroundColor: "white", flex: 1, 
                display: "flex", flexFlow: "row wrap", alignItems: "center", justifyContent: "space-between", padding: 10}}>
                
                <div style={{display: "flex", alignItems: "center"}}>
                    <div style={{
                        width: 26, height: 26, borderRadius: 13, marginRight: 15, marginLeft: 10,
                        backgroundColor: node.outdated ? node.errored ? "red" : "orange" : "green",
                    }} />

                    <TextField
                        size="small" value={updatedName || name}
                        label={"Node name"}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        onBlur={(e) => { pythonApi.renameNode(name, e.target.value); setUpdatedName("") }} />
                </div>
                
                <ButtonGroup  size="small" aria-label="outlined primary button group" style={{padding: 10 }}>
                    {(actions || Object.keys(actionButtons)).map((action) => actionButtons[action])}
                </ButtonGroup>
                
                
            </div>
        </div>
        <div style={{ flex: 1, display: "flex", width: "100%", paddingTop: 10, overflow: "hidden"}}>
            {windows.map((w, i) => {
                return <NodeMultiWindow
                    key={`${props.node_id}_window${i}`} 
                    node={node}
                    node_class={node_classes[node.class]}
                    mode={w}
                    modes_props={modes_props}
                    onModeChange={(mode: string) => setWindows(windows.map((w, j) => i === j ? mode : w))}
                    onClose={() => setWindows(windows.filter((w, j) => i !== j))}
                    style={{ 
                        flex: 1, borderRadius: 5, height: "100%",
                        backgroundColor: "white",
                        marginLeft: i === 0 ? 0 : 10,
                    }} />
            })}
        </div>
    </div>    
}

export default NodeDashboard;