"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { useTransactions } from "@/contexts/TransactionContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function TableManager() {
  const { tables, currentTable, switchTable, addTable } = useTransactions()
  const [isNewTableDialogOpen, setIsNewTableDialogOpen] = useState(false)
  const [newTableName, setNewTableName] = useState("")

  const handleCreateTable = () => {
    if (newTableName.trim()) {
      addTable(newTableName.trim())
      setNewTableName("")
      setIsNewTableDialogOpen(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={currentTable?.id} onValueChange={switchTable}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecione uma tabela" />
        </SelectTrigger>
        <SelectContent>
          {tables.map((table) => (
            <SelectItem key={table.id} value={table.id}>
              {table.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" onClick={() => setIsNewTableDialogOpen(true)}>
        <Plus className="h-4 w-4" />
      </Button>

      <Dialog open={isNewTableDialogOpen} onOpenChange={setIsNewTableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Tabela</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da tabela</Label>
              <Input
                id="name"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                placeholder="Ex: Gastos Pessoais"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsNewTableDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTable}>Criar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

