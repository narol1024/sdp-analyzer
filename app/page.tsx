"use client";

import React, { useState } from "react";
import {
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  ChipProps,
  Divider,
} from "@nextui-org/react";
import { SDPResults } from "sdp-analyzer/dist/types";

const columns = [
  { name: "Package Name", uid: "Package Name" },
  { name: "Fan-in", uid: "Fan-in" },
  { name: "Fan-out", uid: "Fan-out" },
  { name: "Instability", uid: "Instability" },
  { name: "Score", uid: "Score" },
];

const scoreColorMap: Record<string, ChipProps["color"]> = {
  Stable: "success",
  Normal: "primary",
  Flexible: "warning",
  Instable: "danger",
};

interface SDPResultsGroupTableProps {
  SDPResultsGroup: SDPResults[];
}

function SDPResultsGroupTable({ SDPResultsGroup }: SDPResultsGroupTableProps) {
  const renderCell = React.useCallback(
    (sdpResults: SDPResults, columnKey: React.Key) => {
      switch (columnKey) {
        case "Package Name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{sdpResults.name}</p>
            </div>
          );
        case "Fan-in":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{sdpResults.fanIn}</p>
            </div>
          );
        case "Fan-out":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {sdpResults.fanOut}
              </p>
            </div>
          );
        case "Instability":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {sdpResults.instability.toFixed(4)}
              </p>
            </div>
          );
        case "Score":
          return (
            <Chip
              className="capitalize"
              color={scoreColorMap[sdpResults.label]}
              size="sm"
              variant="flat"
            >
              {sdpResults.label}
            </Chip>
          );
        default:
          return "";
      }
    },
    []
  );

  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={SDPResultsGroup}>
        {(item) => (
          <TableRow key={item.name}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default function Home() {
  const [textValue, changeTextValue] = useState("");
  const [SDPResultsGroup, setSDPResultsGroup] = useState([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  return (
    <div className="flex w-full flex-col flex-wrap md:flex-nowrap gap-4 px-4 py-4 mt-4">
      <Input
        type="text"
        label="Package Name:"
        labelPlacement="outside"
        placeholder="Enter the package name, like react."
        size="lg"
        value={textValue}
        classNames={{
          inputWrapper: "h-[60px]",
          label: "text-2xl font-bold",
          input: "text-2xl",
        }}
        onValueChange={changeTextValue}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            try {
              setIsQuerying(true);
              setErrorMsg("");
              const res = await fetch(`/api/query?packages=${textValue}`, {
                cache: "no-store",
                method: "GET",
              });
              const { result, message } = await res.json();
              if (result && result.length) {
                setSDPResultsGroup(result);
              } else {
                setErrorMsg(message);
              }
            } catch (error) {
              setErrorMsg("Querying was unsuccessful. Please retry once.");
            } finally {
              setIsQuerying(false);
            }
          }
        }}
      />
      <Divider />
      {SDPResultsGroup.length > 0 && !isQuerying && !errorMsg && (
        <SDPResultsGroupTable SDPResultsGroup={SDPResultsGroup} />
      )}
      {isQuerying && (
        <p className="w-full text-center">
          Querying, please wait for a few seconds...
        </p>
      )}
      {errorMsg && <p className="w-full text-center">{errorMsg}</p>}
    </div>
  );
}
